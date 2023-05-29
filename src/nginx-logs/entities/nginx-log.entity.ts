import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class Log {
  file: File;
}

export class File {
  path: string;
}

export class Event {
  original: string;
}

export class Host {
  name: string;
}

@Schema()
export class NginxLog {
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

export const NginxLogSchema = SchemaFactory.createForClass(NginxLog);
