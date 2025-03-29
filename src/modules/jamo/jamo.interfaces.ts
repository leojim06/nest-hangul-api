import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}
