import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import LoggerInstance from '../loaders/logger';

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

export const authorizeRole = (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  console.log('Authorized');
  next();
};
