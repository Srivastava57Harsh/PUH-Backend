import { Router } from 'express';
import { signup, login, getProfile } from './controller';
import { authenticateToken } from '../../middlewares/auth';
import { getProfileValidator, loginValidator, signUpValidator } from './validator';

const authRouter = Router();

authRouter.post('/signup', signUpValidator, signup);
authRouter.post('/login', loginValidator, login);
authRouter.get('/profile', authenticateToken, getProfileValidator, getProfile);

export default authRouter;
