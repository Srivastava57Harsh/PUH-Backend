import { Router } from 'express';
import { bookSession } from './controller';
import { authenticateToken, authorizeRole, checkUserVerification } from '../../middlewares/auth';
import { bookSessionvalidator } from './validator';

const bookingsRouter = Router();

bookingsRouter.post(
  '/book',
  authenticateToken,
  bookSessionvalidator,
  authorizeRole(['user']),
  checkUserVerification,
  bookSession,
);

export default bookingsRouter;
