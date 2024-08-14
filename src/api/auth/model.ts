import { Request } from 'express';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  isVerified: boolean;
  role: string;
  otp: string;
}

export interface DecodedToken {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export default User;
