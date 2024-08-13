import { Router } from 'express';
import { signup, login } from './controller';
import { authenticateToken } from '../../middlewares/auth';
import { getProfileValidator, loginValidator, signUpValidator } from './validator';

const authRouter = Router();

authRouter.post('/signup', signUpValidator, signup);
authRouter.post('/login', loginValidator, login);
authRouter.get('/profile', authenticateToken, getProfileValidator, (req, res) => {
  res.json(req.user);
});

export default authRouter;
