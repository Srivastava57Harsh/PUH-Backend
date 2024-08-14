import { Request, Response } from 'express';
import database from '../loaders/database';
import nodemailer from 'nodemailer';
import LoggerInstance from '../loaders/logger';

export async function sendOTP(email: string) {
  try {
    const usersCollection = (await database()).collection('profiles');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await usersCollection.updateOne({ email }, { $set: { otp, otpCreatedAt: new Date() } });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'plateuptask@gmail.com',
        pass: 'ruuk whgj vplr cymj',
      },
    });

    const mailOptions = {
      from: 'plateuptask@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    LoggerInstance.info('OTP email sent successfully');
  } catch (error) {
    LoggerInstance.error('Error sending OTP:', error.message);
    throw error;
  }
}

export async function verifyOTP(email: string, otp: string): Promise<string> {
  try {
    const usersCollection = (await database()).collection('profiles');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const otpExpirationTime = new Date(user.otpCreatedAt);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 10);

    if (new Date() > otpExpirationTime) {
      throw new Error('OTP has expired');
    }

    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    await usersCollection.updateOne({ email }, { $set: { isVerified: true }, $unset: { otp: '', otpCreatedAt: '' } });

    return 'User verified successfully';
  } catch (error) {
    LoggerInstance.error('Error verifying OTP:', error.message);
    throw error;
  }
}
