import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audio, AudioDocument } from './audio.schema';

@Injectable()
export class AudioRepository {
  constructor(
    @InjectModel(Audio.name) private readonly audioModel: Model<AudioDocument>,
  ) {}

  async findByJamoId(jamoId: string): Promise<AudioDocument[]> {
    return this.audioModel.find({ jamoId }).lean();
  }

  async create(audio: Partial<Audio>): Promise<AudioDocument> {
    console.log('Audio> ', audio);
    return this.audioModel.create(audio);
  }
}
