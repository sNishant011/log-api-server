import { Module } from '@nestjs/common';
import { NginxLogsService } from './nginx-logs.service';
import { NginxLogsController } from './nginx-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NginxLog, NginxLogSchema } from './entities/nginx-log.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NginxLog.name, schema: NginxLogSchema },
    ]),
  ],
  controllers: [NginxLogsController],
  providers: [NginxLogsService],
})
export class NginxLogsModule {}
