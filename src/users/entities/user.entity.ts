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

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
  })
  role: UserRole;

  @Prop({ type: String })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
