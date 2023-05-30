import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';
import { Request } from 'express';

export type jwtPayload = {
  _id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      usernameField: 'email',
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['accessToken'];
          if (!token) {
            throw new UnauthorizedException();
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
    });
  }

  async validate(payload: jwtPayload): Promise<jwtPayload> {
    return payload;
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['refreshToken'];
          console.log(token);
          if (!token) {
            throw new UnauthorizedException();
          }
          return token;
        },
      ]),
    });
  }

  validate(req: Request, payload: jwtPayload) {
    const refreshToken = req?.cookies?.['refreshToken'];
    console.log(refreshToken);
    return { ...payload, refreshToken };
  }
}
