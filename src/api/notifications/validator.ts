import { NextFunction, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { sendMailSchema, calendarInviteSchema } from './schema';

export async function sendBookingMailValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body = await sendMailSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}

export async function sendCalenderInviteValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body = await calendarInviteSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}
