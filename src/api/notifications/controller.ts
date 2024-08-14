import { Request, Response } from 'express';
import { sendBookingConfirmation, createGoogleCalendarEvent } from './services';
import LoggerInstance from '../../loaders/logger';
import database from '../../loaders/database';
import { ObjectId } from 'mongodb';

export async function sendEmailNotification(req: Request, res: Response) {
  try {
    const { sessionId, title, description } = req.body;

    const bookingsCollection = (await database()).collection('bookings');
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { userEmail, speakerEmail, sessionDetails } = booking;

    await sendBookingConfirmation(userEmail, speakerEmail, title, description, sessionDetails);
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function createCalendarInvite(req: Request, res: Response) {
  try {
    const { sessionId, title, description } = req.body;

    const bookingsCollection = (await database()).collection('bookings');
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { userEmail, speakerEmail, sessionDetails } = booking;

    await createGoogleCalendarEvent(userEmail, speakerEmail, title, description, sessionDetails);
    res.status(200).json({ message: 'Google Calendar invite sent successfully' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}
