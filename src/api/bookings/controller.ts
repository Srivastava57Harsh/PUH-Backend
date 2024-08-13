import { Request, Response } from 'express';
import database from '../../loaders/database';
import * as yup from 'yup';

const bookSessionSchema = yup.object().shape({
  speakerId: yup.string().required(),
  date: yup.string().required(),
  timeSlot: yup.string().required(),
});

export const bookSession = async (req: Request, res: Response) => {
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
};
