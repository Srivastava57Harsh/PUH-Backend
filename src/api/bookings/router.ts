import { Router } from 'express';
import { bookSession } from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth';

const bookingsRouter = Router();

bookingsRouter.post('/book', authenticateToken, authorizeRole(['user']), bookSession);

export default bookingsRouter;
