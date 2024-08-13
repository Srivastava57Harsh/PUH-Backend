import { Request, Response } from 'express';
import database from '../../loaders/database';
import { generateToken, verifyToken } from '../../shared/token';
import generateOTP from '../../shared/generateOTP';
import { ObjectId } from 'mongodb';
import LoggerInstance from '../../loaders/logger';
import config from '../../config';
import User from './model';

export async function signup(req: Request, res: Response) {
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
}

export async function login(req: Request, res: Response) {
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
}

export async function getProfile(token: string): Promise<User> {
  let id: string;
  try {
    id = verifyToken(token, config.jwtSecret).id;
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      message: 'Unauthorized Access',
      status: 401,
    };
  }
  const user = await (await database())
    .collection('users')
    .findOne({ _id: new ObjectId(id) }, { projection: { email: 1, name: 1, phone: 1, id: 1 } });
  if (!user) {
    throw {
      message: 'User does not exist',
      status: 404,
    };
  }
  return user;
}
