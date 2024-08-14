import { Router } from 'express';
import { signup, login, getProfile, verifyOtp } from './controller';
import { authenticateToken } from '../../middlewares/auth';
import { loginValidator, otpPayloadValidator, signUpValidator } from './validator';

const authRouter = Router();

authRouter.post('/signup', signUpValidator, signup);
authRouter.post('/verify', otpPayloadValidator, verifyOtp);
authRouter.post('/login', loginValidator, login);
authRouter.get('/profile', authenticateToken, getProfile);

export default authRouter;
