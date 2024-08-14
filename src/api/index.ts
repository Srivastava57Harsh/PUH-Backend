import { Router } from 'express';
import authRouter from './auth/router';
import bookingsRouter from './bookings/router';
import speakerRouter from './speakers/router';
import notificationsRouter from './notifications/router';

export default (): Router => {
  const app = Router();

  app.use('/auth', authRouter);
  app.use('/speakers', speakerRouter);
  app.use('/bookings', bookingsRouter);
  app.use('/notifications', notificationsRouter);

  return app;
};
