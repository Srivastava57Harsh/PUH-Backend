import { Router } from 'express';
import { signup, login, getProfile, verifyOtp, resendOTP } from './controller';
import { authenticateToken, checkUserVerification } from '../../middlewares/auth';
import { loginValidator, signUpValidator } from './validator';

const authRouter = Router();

authRouter.post('/signup', signUpValidator, signup);
authRouter.post('/verify', authenticateToken, verifyOtp);
authRouter.post('/login', loginValidator, login);
authRouter.post('/resendotp', authenticateToken, resendOTP);
authRouter.get('/profile', authenticateToken, checkUserVerification, getProfile);

export default authRouter;
