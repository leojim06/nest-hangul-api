import { Request } from 'express';
import { AudioType } from './audio.schema';

export interface ExtendedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

export interface AudioFileTypeRequest {
  filename: string;
  type: 'Masculino' | 'Femenino' | 'Combinado';
  combinedWith?: string;
}

export interface AudioFileType {
  filename: string;
  type: AudioType;
  combinedWith?: string;
}
