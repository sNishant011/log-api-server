import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApacheLog } from './entities/apache-log.entity';

@Injectable()
export class ApacheLogsService {
  constructor(
    @InjectModel(ApacheLog.name) private apacheModel: Model<ApacheLog>,
  ) {}

  findAll() {
    return this.apacheModel.find().limit(50).exec();
  }

  findOne(id: string) {
    return this.apacheModel.findById(id).exec();
  }

  remove(id: string): Promise<any> {
    return this.apacheModel.deleteOne({ _id: id }).exec();
  }
}
