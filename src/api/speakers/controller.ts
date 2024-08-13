import { Request, Response } from 'express';
import database from '../../loaders/database';
import * as yup from 'yup';

const setupProfileSchema = yup.object().shape({
  expertise: yup.string().required(),
  pricePerSession: yup.number().required(),
});

export const setupProfile = async (req: Request, res: Response) => {
  try {
    const speakersCollection = (await database()).collection('speakers');
    await setupProfileSchema.validate(req.body);
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
};

export const listSpeakers = async (req: Request, res: Response) => {
  try {
    const speakersCollection = (await database()).collection('speakers');
    const speakers = await speakersCollection.find().toArray();
    res.json(speakers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
