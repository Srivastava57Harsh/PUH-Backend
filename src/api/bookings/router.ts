import { Router } from 'express';
import { bookSession } from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth';
import { bookSessionvalidator } from './validator';

const bookingsRouter = Router();

bookingsRouter.post('/book', authenticateToken, bookSessionvalidator, authorizeRole(['user']), bookSession);

export default bookingsRouter;
