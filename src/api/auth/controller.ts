import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import database from '../../loaders/database';
import { generateToken, verifyToken } from '../../shared/token';
import { ObjectId } from 'mongodb';
import { sendOTP, verifyOTP } from '../../shared/otpService';

interface DecodedToken {
  id: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export async function signup(req: Request, res: Response) {
  try {
    const usersCollection = (await database()).collection('users');
    const { firstName, lastName, email, password } = req.body;

    const userExists = await usersCollection.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const saltData = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, saltData);

    await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: 'user',
      isVerified: false,
    });

    await sendOTP(email);

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const usersCollection = (await database()).collection('users');
    const { email, password } = req.body;

    const userExists = await usersCollection.findOne({ email: email });

    if (!userExists) return res.status(401).json({ message: 'User does not exist!' });

    if (bcrypt.compareSync(password, userExists.password)) {
      const token = generateToken(userExists._id.toString(), userExists.role);
      res.json({ token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const id = req.user.id;

  const user = await (await database())
    .collection('users')
    .findOne({ _id: new ObjectId(id) }, { projection: { email: 1, name: 1, id: 1, role: 1 } });
  if (!user) {
    throw {
      message: 'User does not exist',
      status: 404,
    };
  }

  res.status(201).json(user);
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const result = await verifyOTP(email, otp);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
