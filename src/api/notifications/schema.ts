import * as yup from 'yup';

export const sendMailSchema = yup.object({
  sessionId: yup.string().length(24, 'Invalid Speaker ID, shoulb be equal to exact 24 hex characters').required(),
  title: yup.string().required(),
  description: yup.string().required(),
});

export const calendarInviteSchema = yup.object({
  sessionId: yup.string().length(24, 'Invalid Speaker ID, shoulb be equal to exact 24 hex characters').required(),
  title: yup.string().required(),
  description: yup.string().required(),
});
