import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';

@Injectable()
export class PlansService {
  constructor(@InjectRepository(Plans) private plansRepo: Repository<Plans>) {}
  async create(createPlanDto: CreatePlanDto) {
    try {
      const foundPlan = await this.findOneByTitle(createPlanDto.title);
      if (foundPlan)
        throw new BadRequestException('Plan with this title already exists');
      const newPlan = await this.plansRepo.save({
        ...createPlanDto,
        userId: { id: createPlanDto.userId },
      });
      return newPlan;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Plan with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }

  findAll() {
    return this.plansRepo.find({});
  }

  async findOne(id: string) {
    try {
      const foundPlan = await this.plansRepo.findOneByOrFail({ id });
      return foundPlan;
    } catch (error) {
      throw new NotFoundException('Plan not found');
    }
  }
  async findOneByTitle(title: string) {
    try {
      const foundPlan = await this.plansRepo.findOneByOrFail({ title });
      return foundPlan;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, data: UpdatePlanDto) {
    try {
      const foundPlan = await this.findOne(id);
      Object.assign(foundPlan, data);
      await this.plansRepo.save({
        ...data,
        userId: { id: data.userId },
      });
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this plan');
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundPlan = await this.findOne(id);
    if (!foundPlan) throw new NotFoundException('User not Found');
    return this.plansRepo.remove(foundPlan);
  }
}
