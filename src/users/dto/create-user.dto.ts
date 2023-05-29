import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail(undefined, {
    message: 'Email must be a valid email address',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @IsString({
    message: 'Password must be a string',
  })
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
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
