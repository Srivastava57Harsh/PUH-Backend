import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface DecodedToken {
  id: string;
  role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded as DecodedToken;
    next();
  });
};

export const authorizeRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
