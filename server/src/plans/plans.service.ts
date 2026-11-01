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
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';
import { User } from 'src/users/entities/user.entity';
import { roleType } from 'src/users/enum/user.enum';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plans) private plansRepo: Repository<Plans>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createPlanDto: CreatePlanDto, userId: string) {
    try {
      const foundPlan = await this.findOneByTitle(createPlanDto.title);
      if (foundPlan)
        throw new BadRequestException('Plan with this title already exists');
      const newPlan = await this.plansRepo.save({
        ...createPlanDto,
        user: { id: userId },
      });
      return newPlan;
    } catch (error: any) {
      if (error.error === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Plan with these informations already exist',
        );
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.plansRepo.find({});
  }
  async findUserPlans(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { trainer: true },
    });
    if (!user) throw new NotFoundException('user doesnt exist');
    const trainerId = user.role === roleType.TRAINER || user.role === roleType.ADMIN
      ? userId
      : user.trainer?.id;
    if (!trainerId) throw new NotFoundException("trainer doesnt exist");
    return this.plansRepo.find({
      where: { user: { id: trainerId } },
    });
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
      return await this.plansRepo.findOneBy({ title });
    }
  async update(id: string, data: UpdatePlanDto) {
    try {
      const foundPlan = await this.findOne(id);
      Object.assign(foundPlan, data);
      await this.plansRepo.save({
        ...data,
      });
    } catch (error: any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this plan');
      throw new InternalServerErrorException(error.message);
    }
  }
  async remove(id: string) {
    const foundPlan = await this.findOne(id);
    if (!foundPlan) throw new NotFoundException('User not Found');
    return this.plansRepo.remove(foundPlan);
  }
  async assignPlanToClient(trainerId: string, clientId: string, planId: string) {
    const client = await this.userRepo.findOne({
      where: { id: clientId, trainer: { id: trainerId } },
    });
    if (!client) throw new NotFoundException('Client not assigned to you');
    const plan = await this.findOne(planId);
    if (!plan) throw new NotFoundException('Plan not found');
    const today = new Date();
    const activePlan = await this.plansRepo.findOne({
      where: {
        user: { id: clientId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
    });
    if (activePlan) {
      const start = new Date(activePlan.startDate).toISOString().split('T')[0];
      const end = new Date(activePlan.endDate).toISOString().split('T')[0];
      throw new BadRequestException(
        `Client already has an active plan: "${activePlan.title}" (${start} to ${end})`
      );
    }
    const clientPlan = this.plansRepo.create({
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate,
      endDate: plan.endDate,
      user: { id: clientId },
    });
    return this.plansRepo.save(clientPlan);
  }
  async removePlanFromClient(trainerId: string, clientId: string, planId: string) {
    const client = await this.userRepo.findOne({
      where: { id: clientId, trainer: { id: trainerId } },
    });
    if (!client) throw new NotFoundException('Client not assigned to you');

    const plan = await this.plansRepo.findOne({
      where: { id: planId, user: { id: clientId } },
    });
    if (!plan) throw new NotFoundException('Plan not found for this client');

    return this.plansRepo.remove(plan);
  }
  async findClientPlans(trainerId: string, clientId: string) {
    // Single query with JOIN to verify trainer-client relationship and fetch plans
    const plans = await this.plansRepo
      .createQueryBuilder('plan')
      .innerJoin('plan.user', 'client')
      .innerJoin('client.trainer', 'trainer')
      .where('trainer.id = :trainerId', { trainerId })
      .andWhere('client.id = :clientId', { clientId })
      .getMany();

    if (!plans.length) {
      const client = await this.userRepo.findOne({
        where: { id: clientId, trainer: { id: trainerId } },
      });
      if (!client) throw new NotFoundException('Client not assigned to you');
    }
    return plans;
  }

  async findClientActivePlan(trainerId: string, clientId: string) {
    const today = new Date();
    const plan = await this.plansRepo
      .createQueryBuilder('plan')
      .innerJoin('plan.user', 'client')
      .innerJoin('client.trainer', 'trainer')
      .where('trainer.id = :trainerId', { trainerId })
      .andWhere('client.id = :clientId', { clientId })
      .andWhere('plan.startDate <= :today', { today })
      .andWhere('plan.endDate >= :today', { today })
      .getOne();
    if (!plan) {
      const client = await this.userRepo.findOne({
        where: { id: clientId, trainer: { id: trainerId } },
      });
      if (!client) throw new NotFoundException('Client not assigned to you');
    }
    return plan;
  }
}
