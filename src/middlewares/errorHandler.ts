// Cureently this unified error handler is not being used, but has a future potential to used as handler where ever needed.
// - Author (Harsh)

import { Request, Response, NextFunction } from 'express';
import LoggerInstance from '../loaders/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  LoggerInstance.error(err.stack);
  res.status(500).json({ message: err.message });
};
