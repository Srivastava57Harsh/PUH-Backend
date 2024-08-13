import { Router } from 'express';
import { setupProfile, listSpeakers } from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth';
import { setupProfilevalidator } from './validator';

const speakerRouter = Router();

speakerRouter.post('/setup', authenticateToken, setupProfilevalidator, authorizeRole(['speaker']), setupProfile);
speakerRouter.get('/list', authenticateToken, listSpeakers);

export default speakerRouter;
