import { NextFunction, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { setupProfileSchema } from './schema';

export async function setupProfilevalidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body = await setupProfileSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}
