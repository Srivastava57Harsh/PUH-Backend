import * as yup from 'yup';

const setupProfile = {
  expertise: yup.string().required(),
  pricePerSession: yup.number().required(),
};

export const setupProfileSchema = new yup.ObjectSchema(setupProfile);
