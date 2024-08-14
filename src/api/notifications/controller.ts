// controllers/yourController.ts
import { Request, Response } from 'express';
import { sendBookingConfirmation, createGoogleCalendarEvent, verifyBooking } from './services';
import LoggerInstance from '../../loaders/logger';

export async function sendEmailNotification(req: Request, res: Response) {
  try {
    const { sessionId, userEmail, speakerEmail, sessionDetails } = req.body;

    await verifyBooking(sessionId, userEmail, speakerEmail, sessionDetails);

    await sendBookingConfirmation(userEmail, speakerEmail, sessionDetails);
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function createCalendarInvite(req: Request, res: Response) {
  try {
    const { sessionId, userEmail, speakerEmail, sessionDetails } = req.body;

    await verifyBooking(sessionId, userEmail, speakerEmail, sessionDetails);

    await createGoogleCalendarEvent(userEmail, speakerEmail, sessionDetails);
    res.status(200).json({ message: 'Google Calendar invite sent successfully' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}
