import { Request, Response } from 'express';
import database from '../../loaders/database';
import { AuthenticatedRequest } from './model';
import LoggerInstance from '../../loaders/logger';
import { ObjectId } from 'mongodb';

export async function setupProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const speakersCollection = (await database()).collection('speakers');
    const { expertise, pricePerSession } = req.body;

    await speakersCollection.insertOne({
      userId: req.user.id,
      expertise,
      pricePerSession,
    });

    res.status(201).json({ message: 'Speaker profile set up successful' });
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function listSpeakers(req: Request, res: Response) {
  try {
    const speakersCollection = (await database()).collection('speakers');
    const speakers = await speakersCollection.find().toArray();
    res.json(speakers);
  } catch (error) {
    LoggerInstance.error(error);
    res.status(500).json({ message: error.message });
  }
}
