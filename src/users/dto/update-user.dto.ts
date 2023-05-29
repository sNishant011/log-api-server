import { UserRole } from '../entities/user.entity';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
export class UpdateUserDto {
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail(undefined, {
    message: 'Email must be a valid email address',
  })
  @IsOptional()
  email: string;

  @IsString({
    message: 'Password must be a string',
  })
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password is not strong enough',
    },
  )
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
