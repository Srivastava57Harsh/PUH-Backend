import { NextFunction, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { bookSessionSchema } from './schema';

export async function bookSessionvalidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body = await bookSessionSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}
