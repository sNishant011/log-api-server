import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NginxLog } from './entities/nginx-log.entity';

@Injectable()
export class NginxLogsService {
  constructor(
    @InjectModel(NginxLog.name) private nginxModel: Model<NginxLog>,
  ) {}

  findAll() {
    return this.nginxModel.find().limit(50).exec();
  }

  findOne(id: string) {
    return this.nginxModel.findById(id).exec();
  }

  remove(id: string): Promise<any> {
    return this.nginxModel.deleteOne({ _id: id }).exec();
  }
}
