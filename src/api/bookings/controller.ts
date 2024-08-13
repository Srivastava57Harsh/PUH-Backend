import { Request, Response } from 'express';
import database from '../../loaders/database';
import { bookSessionSchema } from './schema';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export async function bookSession(req: AuthenticatedRequest, res: Response) {
  try {
    const bookingsCollection = (await database()).collection('bookings');
    await bookSessionSchema.validate(req.body);
    const { speakerId, date, timeSlot } = req.body;

    const existingBooking = await bookingsCollection.findOne({ speakerId, date, timeSlot });
    if (existingBooking) return res.status(400).json({ message: 'Time slot already booked' });

    const booking = await bookingsCollection.insertOne({
      userId: req.user.id,
      speakerId,
      date,
      timeSlot,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
