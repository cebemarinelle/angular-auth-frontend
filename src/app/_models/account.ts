import { Role } from './role';

export class Account {
  id?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  jwtToken?: string;
  isVerified?: boolean;
  verificationToken?: string;
  resetToken?: string;
  dateCreated?: string;
  refreshTokens?: string[];
}