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

  findAll(ipAddress?: string, date?: string) {
    const queryObject: {
      remote_ip?: string;
      date?: string;
    } = {};
    if (ipAddress) {
      queryObject['remote_ip'] = ipAddress;
    }
    if (date) {
      queryObject['timestamp'] = new RegExp(`.*${date}.*`);
    }
    return this.nginxModel.find(queryObject).exec();
  }

  findOne(id: string) {
    return this.nginxModel.findById(id).exec();
  }

  remove(id: string): Promise<any> {
    return this.nginxModel.deleteOne({ _id: id }).exec();
  }

  async getDataForVisualization() {
    const count = await this.nginxModel.countDocuments();
    const uniqueIPAddresses = await this.getIPAddresses();
    const mostCommonIP = await this.getRequestCountBy('remote_ip');
    const mostCommonHTTPMethod = await this.getRequestCountBy('http_method');
    const requestByTime = await this.getRequestCountByTimestamp();
    const requestCountByStatus = await this.getRequestCountBy('response_code');
    const requestCountByResponseSize = await this.getRequestCountBy('bytes');
    const requestCountByUserAgent = await this.getRequestCountBy('user_agent');
    return {
      count,
      uniqueIPCount: uniqueIPAddresses.length,
      mostCommonIP,
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

  async getIPAddresses() {
    try {
      const result = await this.nginxModel.aggregate([
        {
          $group: {
            _id: '$remote_ip',
          },
        },
        {
          $project: {
            ipAddress: '$_id',
            _id: 0,
          },
        },
      ]);
      return result.map((entry) => entry.ipAddress);
    } catch (error) {
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
