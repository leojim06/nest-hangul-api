import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jamo, JamoDocument } from './jamo.schema';
import { Model } from 'mongoose';

@Injectable()
export class JamoRepository {
  constructor(@InjectModel(Jamo.name) private jamoModel: Model<JamoDocument>) {}

  async create(data: Partial<Jamo>): Promise<Jamo> {
    return this.jamoModel.create(data);
  }

  async findAll(): Promise<Jamo[]> {
    return this.jamoModel.find().exec();
  }

  async findOne(id: string): Promise<Jamo | null> {
    return this.jamoModel.findOne({ id }).exec();
  }

  async update(id: string, data: Partial<Jamo>): Promise<Jamo | null> {
    return this.jamoModel.findOneAndUpdate({ id }, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Jamo | null> {
    return this.jamoModel.findOneAndDelete({ id }).exec();
  }
}
