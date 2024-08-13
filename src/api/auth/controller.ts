import { Request, Response } from 'express';
import database from '../../loaders/database';
import { generateToken } from '../../shared/token';
import generateOTP from '../../shared/generateOtp';

export const signup = async (req: Request, res: Response) => {
  try {
    const usersCollection = (await database()).collection('users');
    const { firstName, lastName, email, password } = req.body;

    const userExists = await usersCollection.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    await usersCollection.insertOne({ firstName, lastName, email, password, role: 'user', isVerified: false });

    const otp = generateOTP();
    //sendOTPEmail(email, otp);

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const usersCollection = (await database()).collection('users');
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email, password });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id.toString(), user.role);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
