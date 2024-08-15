import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import LoggerInstance from '../loaders/logger';
import { ObjectId } from 'mongodb';
import database from '../loaders/database';

interface DecodedToken {
  id: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded as DecodedToken;
      next();
    });
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      message: 'Unauthorized Access',
      status: 401,
    };
  }
};

export const checkUserVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const usersCollection = (await database()).collection('profiles');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your account to continue further.' });
    }

    next();
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const authorizeRole = (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  LoggerInstance.info('Authrized');
  next();
};
