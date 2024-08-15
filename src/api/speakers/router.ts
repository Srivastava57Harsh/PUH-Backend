import { Router } from 'express';
import { setupProfile, listSpeakers } from './controller';
import { authenticateToken, authorizeRole, checkUserVerification } from '../../middlewares/auth';
import { setupProfilevalidator } from './validator';

const speakerRouter = Router();

speakerRouter.post(
  '/setup',
  authenticateToken,
  setupProfilevalidator,
  authorizeRole(['speaker']),
  checkUserVerification,
  setupProfile,
);
speakerRouter.get('/list', authenticateToken, checkUserVerification, listSpeakers);

export default speakerRouter;
