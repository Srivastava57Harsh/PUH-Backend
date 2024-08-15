import { Router } from 'express';
import { sendEmailNotification, createCalendarInvite } from './controller';
import { authenticateToken, checkUserVerification } from '../../middlewares/auth';
import { sendBookingMailValidator, sendCalenderInviteValidator } from './validator';

const notificationsRouter = Router();

notificationsRouter.post(
  '/sendmail',
  authenticateToken,
  sendBookingMailValidator,
  checkUserVerification,
  sendEmailNotification,
);
notificationsRouter.post(
  '/calendarinvite',
  authenticateToken,
  sendCalenderInviteValidator,
  checkUserVerification,
  createCalendarInvite,
);

export default notificationsRouter;
