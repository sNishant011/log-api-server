import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  getAggregationPipeline,
  groupByTimestampPipeline,
} from 'src/utils/aggregation-pipeline.util';
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

  async getDataForVisualization() {
    const count = await this.nginxModel.countDocuments();
    const uniqueIPAddresses = await this.getRequestCountBy('remote_ip');
    const mostCommonHTTPMethod = await this.getRequestCountBy('http_method');
    const requestByTime = await this.getRequestCountByTimestamp();
    const requestCountByStatus = await this.getRequestCountBy('response_code');
    const requestCountByResponseSize = await this.getRequestCountBy('bytes');
    const requestCountByUserAgent = await this.getRequestCountBy('user_agent');
    return {
      count,
      uniqueIPCount: uniqueIPAddresses.length,
      mostCommonIP: uniqueIPAddresses.slice(0, 10),
      mostCommonHTTPMethod,
      requestByTime,
      requestCountByStatus,
      requestCountByResponseSize,
      requestCountByUserAgent,
    };
  }
  async getRequestCountBy(fieldName: string) {
    try {
      const result = await this.nginxModel.aggregate(
        getAggregationPipeline(fieldName),
      );

      return result.filter((res) => res.value);
    } catch (error) {
      // Handle error
      throw error;
    }
  }

  async getRequestCountByTimestamp() {
    try {
      const result = await this.nginxModel.aggregate(groupByTimestampPipeline);

      return result
        .filter((entry) => entry._id)
        .map((entry) => ({
          value: entry._id === null ? 'Unknown' : entry._id,
          count: entry.count,
        }));
    } catch (error) {
      // Handle error
      throw error;
    }
  }
}
