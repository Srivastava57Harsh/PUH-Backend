import { Router } from 'express';
import { sendEmailNotification, createCalendarInvite } from './controller';
import { authenticateToken } from '../../middlewares/auth';
import { sendBookingMailValidator, sendCalenderInviteValidator } from './validator';

const notificationsRouter = Router();

notificationsRouter.post('/sendmail', authenticateToken, sendBookingMailValidator, sendEmailNotification);
notificationsRouter.post('/calendarinvite', authenticateToken, sendCalenderInviteValidator, createCalendarInvite);

export default notificationsRouter;
