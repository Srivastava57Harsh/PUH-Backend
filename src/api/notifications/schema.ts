import * as yup from 'yup';

export const sendMailSchema = yup.object({
  sessionId: yup.string().length(24, 'Invalid Speaker ID, shoulb be equal to exact 24 hex characters').required(),
  userEmail: yup.string().email().required(),
  speakerEmail: yup.string().email().required(),
  sessionDetails: yup
    .object({
      title: yup.string().required(),
      description: yup.string().required(),
      date: yup.string().required(),
      timeSlot: yup
        .object({
          start: yup.string().required(),
          end: yup.string().required(),
        })
        .required(),
    })
    .required(),
});

export const calendarInviteSchema = yup.object({
  sessionId: yup.string().length(24, 'Invalid Speaker ID, shoulb be equal to exact 24 hex characters').required(),
  userEmail: yup.string().email().required(),
  speakerEmail: yup.string().email().required(),
  sessionDetails: yup
    .object({
      title: yup.string().required(),
      description: yup.string().required(),
      date: yup.string().required(),
      timeSlot: yup
        .object({
          start: yup.string().required(),
          end: yup.string().required(),
        })
        .required(),
    })
    .required(),
});
