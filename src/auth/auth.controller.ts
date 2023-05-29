import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { jwtPayload } from './strategy/jwt.strategy';
import { LoginDto } from './strategy/local.strategy';
import { AccessAuthGuard, RefreshAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @Req() req: Request & { user: jwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
    });
    return { message: 'Login success' };
  }

  @UseGuards(AccessAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request & { user: jwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(req.user._id);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return result;
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request & { user: jwtPayload & { refreshToken: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user._id,
      req.user.refreshToken,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
    });
  }
}
