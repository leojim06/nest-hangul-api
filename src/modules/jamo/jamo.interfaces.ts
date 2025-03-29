import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}
