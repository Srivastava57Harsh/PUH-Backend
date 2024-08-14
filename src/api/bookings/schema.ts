import * as yup from 'yup';

const timeSlotSchema = yup.object().shape({
  start: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
    .required(),
  end: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
    .required(),
});

const bookSessionSchema = yup.object().shape({
  speakerId: yup.string().length(24, 'Invalid Speaker ID, shoulb be equal to exact 24 hex characters').required(),
  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .required(),
  timeSlot: timeSlotSchema.required(),
});

export { bookSessionSchema };
