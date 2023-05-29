import { JwtService } from '@nestjs/jwt';
import { genSalt, hash, compare } from 'bcrypt';
import { jwtPayload } from 'src/auth/strategy/jwt.strategy';

export const getPasswordHash = async (
  plainText: string,
  saltRounds: number,
) => {
  const salt = await genSalt(saltRounds);
  return { salt, passwordHash: await hash(plainText, salt) };
};

export const isPasswordValid = async (plainPassword: string, hash: string) => {
  const isMatch = await compare(plainPassword, hash);
  return isMatch;
};

export const generateToken = async (payload: jwtPayload) => {
  const jwtService = new JwtService();
  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }),
    jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }),
  ]);
  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string) => {
  const jwtService = new JwtService();
  const payload = await jwtService.verifyAsync(token, {
    secret: process.env.ACCESS_TOKEN_SECRET,
  });
  return payload;
};

export const verifyRefreshToken = async (token: string) => {
  const jwtService = new JwtService();
  const payload = await jwtService.verifyAsync(token, {
    secret: process.env.REFRESH_TOKEN_SECRET,
  });
  return payload;
};
