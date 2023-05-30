import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { ApacheLog } from './entities/apache-log.entity';

@Injectable()
export class ApacheLogsService {
  constructor(
    @InjectModel(ApacheLog.name) private apacheModel: Model<ApacheLog>,
  ) {}

  async getDataForVisualization() {
    const count = await this.apacheModel.countDocuments();
    const mostCommonIP = await this.getMostCommonIP();
    const mostCommonHTTPMethod = await this.getMostCommonHTTPMethod();
    const requestByTime = await this.getRequestCountByTimestamp();
    const requestCountByStatus = await this.getRequestCountBy('response_code');
    const requestCountByResponseSize = await this.getRequestCountBy('bytes');
    const requestCountByUserAgent = await this.getRequestCountBy('user_agent');
    return {
      count,
      mostCommonIP,
      mostCommonHTTPMethod,
      requestByTime,
      requestCountByStatus,
      requestCountByResponseSize,
      requestCountByUserAgent,
    };
  }

  async getMostCommonIP() {
    try {
      const result = await this.apacheModel.aggregate([
        {
          $group: {
            _id: '$remote_ip',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);
      return result.map((res) => ({ ip: res._id, count: res.count }));
    } catch (error) {}
  }

  async getMostCommonHTTPMethod() {
    try {
      const result = await this.apacheModel.aggregate([
        {
          $group: {
            _id: '$http_method',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      return result.map((item) => ({
        request: item._id,
        count: item.count,
      }));
    } catch (error) {
      throw error;
    }
  }
  async getRequestCountByTimestamp(): Promise<
    { timestamp: Date; count: number }[]
  > {
    try {
      const result = await this.apacheModel.aggregate([
        {
          $addFields: {
            formattedTimestamp: {
              $dateFromString: {
                dateString: '$timestamp',
              },
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:00',
                date: '$formattedTimestamp',
                timezone: '+00:00',
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            timestamp: {
              $dateFromString: {
                dateString: '$_id',
                format: '%Y-%m-%d %H:%M:00',
              },
            },
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            timestamp: 1,
          },
        },
      ]);

      return result.map((entry) => ({
        timestamp: entry.timestamp,
        count: entry.count,
      }));
    } catch (error) {
      // Handle error
      throw error;
    }
  }

  async getRequestCountBy(fieldName: Omit<keyof User, 'timestamp'>) {
    try {
      const result = await this.apacheModel.aggregate([
        {
          $group: {
            _id: `$${fieldName}`,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            value: '$_id',
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      return result;
    } catch (error) {
      // Handle error
      throw error;
    }
  }

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
