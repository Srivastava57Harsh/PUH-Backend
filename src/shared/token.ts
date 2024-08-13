import jwt from 'jsonwebtoken';
import config from '../config';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string, secret: string): any => jwt.verify(token, secret);
