import * as yup from 'yup';

const bookSession = {
  speakerId: yup.string().required(),
  date: yup.string().required(),
  timeSlot: yup.string().required(),
};

export const bookSessionSchema = new yup.ObjectSchema(bookSession);
