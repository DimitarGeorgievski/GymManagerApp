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
      const newUser = await this.usersRepo.save({
        ...createData,
        refreshTokens: [],
      });
      return newUser;
    } catch (error: any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'User with these informations already exist',
        );
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.usersRepo.find({});
  }

  async findOne(id: string, relations?: string[]) {
    try {
      const foundUser = await this.usersRepo.findOneOrFail({
        where: { id },
        relations: relations
          ? relations.reduce((acc, r) => ({ ...acc, [r]: true }), {})
          : undefined,
      });
      return foundUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  async findOneByEmail(email: string, relations?: string[]) {
    return this.usersRepo.findOne({
      where: { email },
      relations: relations
        ? relations.reduce((acc, r) => ({ ...acc, [r]: true }), {})
        : undefined,
    });
  }
  async update(id: string, data: UpdateUserDto) {
    try {
      const foundUser = await this.findOne(id);
      Object.assign(foundUser, data);
      await this.usersRepo.save(data);
    } catch (error: any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this user');
      throw new InternalServerErrorException(error.message);
    }
  }
  async remove(id: string) {
    const foundUser = await this.findOne(id);
    if (!foundUser) throw new NotFoundException('User not Found');
    return this.usersRepo.remove(foundUser);
  }
  async saveRefreshToken(id: string, token: string) {
    const user = await this.findOne(id);
    const tokens = (user.refreshTokens ?? []).concat(token);
    await this.usersRepo.update(id, { refreshTokens: tokens });
  }
  async deleteRefreshToken(id: string, token: string) {
    const user = await this.findOne(id);
    const tokens = (user.refreshTokens ?? []).filter((t) => t !== token);
    await this.usersRepo.update(id, { refreshTokens: tokens });
  }
}
