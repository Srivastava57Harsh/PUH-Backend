import { Router } from 'express';
import { setupProfile, listSpeakers } from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth';

const speakerRouter = Router();

speakerRouter.post('/setup', authenticateToken, authorizeRole(['speaker']), setupProfile);
speakerRouter.get('/list', authenticateToken, listSpeakers);

export default speakerRouter;
