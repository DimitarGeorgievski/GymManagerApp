import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';
import { Between, Repository } from 'typeorm';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(@InjectRepository(Food) private foodRepo: Repository<Food>) {}
  async create(createFoodDto: CreateFoodDto) {
    try {
      const foundFood = await this.findOneByName(createFoodDto.name);
      if (foundFood)
        throw new BadRequestException('Food with this title already exists');
      const newFood = await this.foodRepo.save({
        ...createFoodDto,
        userId: { id: createFoodDto.userId },
      });
      return newFood;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Food with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async getTodaysNutrition(userId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return this.foodRepo.find({
      where: {
        userId: { id: userId },
        createdAt: Between(start, end),
      },
    });
  }
  findAll() {
    return this.foodRepo.find({});
  }

  async findOne(id: string) {
    try {
      const foundFood = await this.foodRepo.findOneByOrFail({ id });
      return foundFood;
    } catch (error) {
      throw new NotFoundException('Food not found');
    }
  }
  async findOneByName(name: string) {
    try {
      const foundFood = await this.foodRepo.findOneByOrFail({ name });
      return foundFood;
    } catch (error) {
      throw new NotFoundException('Food not found');
    }
  }

  async update(id: string, data: UpdateFoodDto) {
    try {
      const foundFood = await this.findOne(id);
      Object.assign(foundFood, data);
      await this.foodRepo.save({
        ...data,
        userId: { id: data.userId },
      });
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this Food');
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundFood = await this.findOne(id);
    if (!foundFood) throw new NotFoundException('Food not Found');
    return this.foodRepo.remove(foundFood);
  }
}
