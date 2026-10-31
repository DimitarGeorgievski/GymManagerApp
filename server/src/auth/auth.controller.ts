import { Controller, Post, Body, Res, HttpCode, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { CredentialsDto } from './dto/credentials.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Throttle({
  default: {
    ttl: 60,
    limit: 5
  },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({ type: CreateUserDto })
  registerUser(@Body() data: CreateUserDto) {
    return this.authService.registerUser(data);
  }
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: CredentialsDto })
  async loginUser(@Body() credentials: CredentialsDto, @Res() res: Response) {
    const { refreshToken, token, user } =
      await this.authService.loginUser(credentials);
    res.set('access-token', token);
    res.set('refresh-token', refreshToken);
    res.json({ user, accessToken: token, refreshToken });
  }
  @HttpCode(204)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 204, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiHeader({ name: 'refresh-token', required: true, description: 'Refresh token' })
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
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiHeader({ name: 'refresh-token', required: true, description: 'Refresh token' })
  logoutUser(@Headers('refresh-token') refreshToken: string) {
    return this.authService.logoutUser(refreshToken);
  }
}