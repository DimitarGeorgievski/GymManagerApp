import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerUser(@Body() data: CreateUserDto) {
    return this.authService.registerUser(data);
  }
  @Post('login')
  async loginUser(@Body() credentials: CredentialsDto, @Res() res: Response) {
    const { refreshToken, token, user } =
      await this.authService.loginUser(credentials);
    res.set('access-token', token);
    res.set('refresh-token', refreshToken);
    res.json({ user, accessToken: token, refreshToken });
  }
  @HttpCode(204)
  @Post('refresh-token')
  async refreshAccessToken(
    @Res() res: Response,
    @Headers('refresh-token') refreshToken: string,
  ) {
    const { token } = await this.authService.refreshAccessToken(refreshToken);
    res.set('access-token', token);
    res.sendStatus(204);
  }
  @HttpCode(204)
  @Post('logout')
  logoutUser(@Headers('refresh-token') refreshToken: string) {
    return this.authService.logoutUser(refreshToken);
  }
}