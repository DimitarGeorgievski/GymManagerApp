import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async registerUser(userData: CreateUserDto) {
    const foundUser = await this.usersService.findOneByEmail(userData.email);
    if (foundUser) throw new BadRequestException('User already exists');
    const hasedPassword = await hash(userData.password, 8);
    userData.password = hasedPassword;
    await this.usersService.create(userData);
  }
  async loginUser(crednetials: CredentialsDto) {
    const foundUser = await this.usersService.findOneByEmail(crednetials.email);
    if (!foundUser) throw new UnauthorizedException('invalid credentials');
    const isPasswordValid = await compare(
      crednetials.password,
      foundUser.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('invalid credentials');
    const token = await this.jwtService.signAsync({ userId: foundUser.id });
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: foundUser.id,
        role: foundUser.roles,
      },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    await this.usersService.saveRefreshToken(foundUser.id, refreshToken);
    const { password, refreshTokens, ...userWithoutPassword } = foundUser;
    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  }
  async refreshAccessToken(refreshToken: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      const foundUser = await this.usersService.findOne(userId);
      const tokenExist = foundUser.refreshTokens.some(
        (token) => token === refreshToken,
      );
      if (!tokenExist) throw new Error();
      const token = await this.jwtService.signAsync({ userId: foundUser.id });
      return { token };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
  async logoutUser(refreshToken: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      await this.usersService.deleteRefreshToken(userId, refreshToken);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("couldn't logout user");
    }
  }
}