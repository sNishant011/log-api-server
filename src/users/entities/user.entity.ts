import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  NGINX = 'nginx',
  APACHE = 'apache',
}

@Schema()
export class User {
  _id?: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
