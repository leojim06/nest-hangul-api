import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jamo, JamoDocument } from './jamo.schema';
import { Model } from 'mongoose';

@Injectable()
export class JamoRepository {
  constructor(
    @InjectModel(Jamo.name) private readonly jamoModel: Model<JamoDocument>,
  ) {}

  async create(data: Partial<Jamo>): Promise<JamoDocument> {
    return this.jamoModel.create(data);
  }

  async findAll(): Promise<JamoDocument[]> {
    return this.jamoModel.find().exec();
  }

  async findOne(id: string): Promise<JamoDocument | null> {
    return this.jamoModel.findOne({ _id: id }).exec();
  }

  async update(id: string, data: Partial<Jamo>): Promise<JamoDocument | null> {
    return this.jamoModel
      .findOneAndUpdate({ _id: id }, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<JamoDocument | null> {
    return this.jamoModel.findOneAndDelete({ _id: id }).exec();
  }

  async findOneWithDetail(id: string): Promise<JamoDocument | null> {
    return await this.jamoModel.findById(id).populate('audios').exec();
  }
}
