import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const sendBookingConfirmation = async (userEmail: string, speakerEmail: string, sessionDetails: any) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [userEmail, speakerEmail],
    subject: 'Booking Confirmation',
    text: `Your session has been booked: ${sessionDetails}`,
  };

  await transporter.sendMail(mailOptions);
};

export const createGoogleCalendarEvent = async (sessionDetails: any) => {
  const { OAuth2 } = google.auth;
  const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: 'Speaker Session',
    description: `Session details: ${sessionDetails}`,
    start: { dateTime: sessionDetails.startTime },
    end: { dateTime: sessionDetails.endTime },
    attendees: [{ email: sessionDetails.userEmail }, { email: sessionDetails.speakerEmail }],
  };

  await calendar.events.insert({ calendarId: 'primary', requestBody: event });
};
