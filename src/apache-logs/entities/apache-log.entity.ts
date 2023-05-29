import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Host, Log } from 'src/nginx-logs/entities/nginx-log.entity';

@Schema()
export class ApacheLog {
  _id: string;

  @Prop()
  log: Log;

  @Prop()
  bytes: string;

  @Prop()
  http_method: string;

  @Prop()
  '@timestamp': string;

  @Prop()
  message: string;

  @Prop()
  remote_ip: string;

  @Prop()
  timestamp: string;

  @Prop()
  response_code: string;

  @Prop()
  referrer: string;

  @Prop()
  event: Event;

  @Prop()
  user_agent: string;

  @Prop()
  '@version': string;

  @Prop()
  tags: string[];

  @Prop()
  host: Host;

  @Prop()
  http_version: string;

  @Prop()
  request_path: string;
}

export const ApacheLogSchema = SchemaFactory.createForClass(ApacheLog);
