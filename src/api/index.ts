import { Router } from 'express';
import authRouter from './auth/router';
import bookingsRouter from './bookings/router';
import speakerRouter from './speakers/router';

export default (): Router => {
  const app = Router();

  app.use('/api/auth', authRouter);
  app.use('/api/speakers', speakerRouter);
  app.use('/api/bookings', bookingsRouter);

  return app;
};
