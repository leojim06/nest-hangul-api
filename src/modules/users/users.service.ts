import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).lean();
  }

  async create(user: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password!, salt);
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
