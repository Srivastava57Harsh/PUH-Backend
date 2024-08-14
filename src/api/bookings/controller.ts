import { Request, Response } from 'express';
import database from '../../loaders/database';
import { bookSessionSchema } from './schema';
import { ObjectId } from 'mongodb';
import { isBookingInFuture, isValidTimeSlot } from './services';
import { AuthenticatedRequest } from './model';
import LoggerInstance from '../../loaders/logger';

export async function bookSession(req: AuthenticatedRequest, res: Response) {
  try {
    const bookingsCollection = (await database()).collection('bookings');
    await bookSessionSchema.validate(req.body);
    const { speakerId, date, timeSlot } = req.body;

    const usersCollection = (await database()).collection('profiles');
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    const speaker = await usersCollection.findOne({ _id: new ObjectId(speakerId) });

    if (!user || !speaker) {
      return res.status(404).json({ message: 'User or Speaker not found' });
    }

    if (!timeSlot || !timeSlot.start || !timeSlot.end || !isValidTimeSlot(timeSlot)) {
      return res.status(400).json({ message: 'Invalid or unsupported time slot' });
    }

    if (!isBookingInFuture(date, timeSlot)) {
      return res.status(400).json({ message: 'The booking date and time must be in the future.' });
    }

    const existingBooking = await bookingsCollection.findOne({ speakerId, date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot already booked for this speaker.' });
    }

    const booking = await bookingsCollection.insertOne({
      userId: req.user.id,
      speakerId,
      date,
      timeSlot,
    });

    res.status(201).json({
      message: 'Time slot has been booked. You will shortly receive the email.',
      bookingId: booking.insertedId,
    });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}
