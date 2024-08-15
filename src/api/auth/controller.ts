import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import database from '../../loaders/database';
import { generateToken } from '../../shared/token';
import { ObjectId } from 'mongodb';
import { sendOTP, verifyOTP } from '../../shared/otpService';
import { AuthenticatedRequest } from './model';
import LoggerInstance from '../../loaders/logger';

export async function signup(req: Request, res: Response) {
  try {
    const usersCollection = (await database()).collection('profiles');
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await usersCollection.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Profile already exists' });
    const saltData = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, saltData);

    await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: role,
      isVerified: false,
    });

    await sendOTP(email);

    res.status(201).json({ message: 'Profile created. Please verify your email.' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const usersCollection = (await database()).collection('profiles');
    const { email, password } = req.body;

    const userExists = await usersCollection.findOne({ email: email });

    if (!userExists) return res.status(401).json({ message: 'Profile does not exist!' });

    if (bcrypt.compareSync(password, userExists.password)) {
      const token = generateToken(userExists._id.toString(), userExists.role);
      res.json({ token });
    }
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.user.id;
    const user = await (await database())
      .collection('profiles')
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { email: 1, firstName: 1, lastName: 1, id: 1, role: 1, isVerified: 1 } },
      );

    res.status(200).json(user);
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const usersCollection = (await database()).collection('profiles');

    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Profile is already verified.' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const result = await verifyOTP(user.email, otp);
    res.status(200).json({ message: result });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function resendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: 'Email id missing, Profile not found' });
    }

    const usersCollection = (await database()).collection('profiles');

    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Profile is already verified.' });
    }

    await sendOTP(email);

    res.status(200).json({ message: 'OTP has been resent to your email.' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}
