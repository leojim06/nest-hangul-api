import { Request } from 'express';
import { UserRole } from '../users/user.schema';

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface UserPayload {
  username: string;
  sub: string;
  role: UserRole;
}

export type UserType = {
  username: string;
  _id: string;
  role: UserRole;
};
