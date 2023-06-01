import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { generateToken, isPasswordValid } from 'src/utils/auth.util';
import { jwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isMatch = await isPasswordValid(password, user.password);
      if (isMatch) {
        return user;
      }
      return null;
    }
    return null;
  }

  async login(user: jwtPayload) {
    const tokens = await generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    await this.userService.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logout success' };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUserInfo(userId);
    const hashedRefreshToken = user.refreshToken;
    const isMatch = await isPasswordValid(refreshToken, hashedRefreshToken);
    if (isMatch) {
      const tokens = await generateToken({
        _id: user.id,
        email: user.email,
        role: user.role,
      });
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }
    return null;
  }
}
