import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async create(createData: CreateUserDto) {
    try {
      const foundUser = await this.findOneByEmail(createData.email);
      if (foundUser)
        throw new BadRequestException('User with this email already exists');
      const newUser = await this.usersRepo.save(createData);
      return newUser;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'User with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }

  findAll() {
    return this.usersRepo.find({});
  }

  async findOne(id: string) {
    try {
      const foundUser = await this.usersRepo.findOneByOrFail({ id });
      return foundUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  async findOneByEmail(email: string) {
    const foundUser = await this.usersRepo.findOne({
      where: { email },
      relations: {
        workouts: true,
        foods: true,
        plans: true,
      },
    });
    if(!foundUser) throw new NotFoundException("user with this email doesn't exist");
    return foundUser
  }
  async update(id: string, data: UpdateUserDto) {
    try {
      const foundUser = await this.findOne(id);
      Object.assign(foundUser, data);
      await this.usersRepo.save(data);
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this user');
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundUser = await this.findOne(id);
    if (!foundUser) throw new NotFoundException('User not Found');
    return this.usersRepo.remove(foundUser);
  }
  async saveRefreshToken(id: string, token: string) {
    const foundUser = await this.findOne(id);
    foundUser.refreshTokens.push(token);
    await this.usersRepo.save(foundUser);
  }
  async deleteRefreshToken(id: string, token: string) {
    const foundUser = await this.findOne(id);
    foundUser.refreshTokens.filter((refreshToken) => refreshToken !== token);
    await this.usersRepo.save(foundUser);
  }
}
