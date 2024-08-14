import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { format, parse } from 'date-fns';
import database from '../../loaders/database';
import { ObjectId } from 'mongodb';

dotenv.config();

export const sendBookingConfirmation = async (userEmail: string, speakerEmail: string, sessionDetails: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const startTimeFormatted = format(
    parse(`${sessionDetails.date} ${sessionDetails.timeSlot.start}`, 'yyyy-MM-dd HH:mm', new Date()),
    'yyyy-MM-dd HH:mm:ss',
  );
  const endTimeFormatted = format(
    parse(`${sessionDetails.date} ${sessionDetails.timeSlot.end}`, 'yyyy-MM-dd HH:mm', new Date()),
    'yyyy-MM-dd HH:mm:ss',
  );

  const sessionDetailsString = `
    Title: ${sessionDetails.title}
    Description: ${sessionDetails.description}
    Date: ${sessionDetails.date}
    Start Time: ${startTimeFormatted}
    End Time: ${endTimeFormatted}
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: [userEmail, speakerEmail],
    subject: 'Booking Confirmation',
    text: `Your session has been booked:\n\n${sessionDetailsString}`,
  };

  await transporter.sendMail(mailOptions);
};

export const createGoogleCalendarEvent = async (userEmail: string, speakerEmail: string, sessionDetails: any) => {


  const { OAuth2 } = google.auth;
  const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const startDateTime = new Date(`${sessionDetails.date}T${sessionDetails.timeSlot.start}:00`);
  const endDateTime = new Date(`${sessionDetails.date}T${sessionDetails.timeSlot.end}:00`);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: sessionDetails.title,
    description: sessionDetails.description,
    start: { dateTime: startDateTime.toISOString() },
    end: { dateTime: endDateTime.toISOString() },
    attendees: [{ email: userEmail }, { email: speakerEmail }],
  };

  await calendar.events.insert({ calendarId: 'primary', requestBody: event });
};

export const verifyBooking = async (
  sessionId: string,
  userEmail: string,
  speakerEmail: string,
  sessionDetails: any,
) => {
  const bookingsCollection = (await database()).collection('bookings');
  const usersCollection = (await database()).collection('profiles');

  const booking = await bookingsCollection.findOne({ _id: new ObjectId(sessionId) });
  if (!booking) {
    throw new Error('Booking not found');
  }

  const user = await usersCollection.findOne({ _id: new ObjectId(booking.userId) });
  if (!user || user.email !== userEmail) {
    throw new Error('User email does not match, Invalid payload details');
  }

  const speaker = await usersCollection.findOne({ _id: new ObjectId(booking.speakerId) });
  if (!speaker || speaker.email !== speakerEmail) {
    throw new Error('Speaker email does not match, Invalid payload details');
  }

  if (
    booking.date !== sessionDetails.date ||
    booking.timeSlot.start !== sessionDetails.timeSlot.start ||
    booking.timeSlot.end !== sessionDetails.timeSlot.end
  ) {
    throw new Error('Session details do not match the booking record');
  }

  return { booking, user, speaker };
};
