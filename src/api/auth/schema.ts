import * as yup from 'yup';

const signUp = {
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  role: yup.string().required(),
  //   otp: yup.string().required(),
  isVerified: yup.boolean().required(),
};

const login = {
  email: yup.string().email().required(),
  password: yup.string().required(),
};

const getProfile = {
  authorization: yup.string().required(),
};

const verifyOTP = {
  email: yup.string().email().required(),
  otp: yup.string().required(),
};

export const loginSchema = new yup.ObjectSchema(login);
export const signupSchema = new yup.ObjectSchema(signUp);
export const getProfileSchema = new yup.ObjectSchema(getProfile);
export const verifyOTPSchema = new yup.ObjectSchema(verifyOTP);
