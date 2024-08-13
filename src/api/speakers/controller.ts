import { Request, Response } from 'express';
import database from '../../loaders/database';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export async function setupProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const speakersCollection = (await database()).collection('speakers');
    const { expertise, pricePerSession } = req.body;

    const speaker = await speakersCollection.insertOne({
      userId: req.user.id,
      expertise,
      pricePerSession,
    });

    res.status(201).json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function listSpeakers(req: Request, res: Response) {
  try {
    const speakersCollection = (await database()).collection('speakers');
    const speakers = await speakersCollection.find().toArray();
    res.json(speakers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
