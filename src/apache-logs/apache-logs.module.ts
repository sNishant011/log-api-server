import { Module } from '@nestjs/common';
import { ApacheLogsService } from './apache-logs.service';
import { ApacheLogsController } from './apache-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApacheLog, ApacheLogSchema } from './entities/apache-log.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApacheLog.name, schema: ApacheLogSchema },
    ]),
  ],
  controllers: [ApacheLogsController],
  providers: [ApacheLogsService],
})
export class ApacheLogsModule {}
