import { Request, Response } from 'express';
import database from '../../loaders/database';
import { AuthenticatedRequest } from './model';
import LoggerInstance from '../../loaders/logger';

export async function setupProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const speakersCollection = (await database()).collection('speakers');

    const existingProfile = await speakersCollection.findOne({ userId: req.user.id });

    if (existingProfile) {
      return res.status(400).json({ message: 'Speaker already exists for this profile' });
    }

    const { expertise, pricePerSession } = req.body;

    await speakersCollection.insertOne({
      profileId: req.user.id,
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
