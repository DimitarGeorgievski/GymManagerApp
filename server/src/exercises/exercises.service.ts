import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseFilterDto } from './dto/filter-exercise.dto';
import { User } from 'src/users/entities/user.entity';
import { roleType } from 'src/users/enum/user.enum';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createData: CreateExerciseDto, userId: string) {
    try {
      const foundExercise = await this.findOneByName(createData.name);
      if (foundExercise)
        throw new BadRequestException('Exercise with this name already exists');
      const newExercise = await this.exerciseRepo.save({
        ...createData,
        createdBy: { id: userId },
      });
      return newExercise;
    } catch (error: any) {
      console.log(error);
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Exercise with these informations already exist',
        );
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll(filters: ExerciseFilterDto) {
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');
    if (filters.name)
      queryBuilder.andWhere('exercise.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    if (filters.muscleGroup)
      queryBuilder.andWhere('exercise.muscleGroup = :mg', {
        mg: filters.muscleGroup,
      });
    queryBuilder.skip(filters.skip).take(filters.take);
    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    try {
      const foundExercise = await this.exerciseRepo.findOneByOrFail({ id });
      return foundExercise;
    } catch (error) {
      throw new NotFoundException('Exercise not found');
    }
  }
  async findOneByName(name: string) {
    const foundExercise = await this.exerciseRepo.findOne({
      where: { name },
    });
    return foundExercise || null;
  }

  async findByUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { trainer: true },
    });
    if (!user) throw new NotFoundException('user doesnt exist');
    const trainerId =
      user.role === roleType.TRAINER || user.role === roleType.ADMIN
        ? userId
        : user.trainer?.id;
    if (!trainerId) throw new NotFoundException("trainer doesnt exist");
    return this.exerciseRepo.find({
      where: { createdBy: { id: trainerId } },
    });
  }
  async update(id: string, data: UpdateExerciseDto) {
    try {
      const foundExercise = await this.findOne(id);
      Object.assign(foundExercise, data);
      await this.exerciseRepo.save({
        ...data,
      });
    } catch (error: any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this Exercise');
      throw new InternalServerErrorException(error.message);
    }
  }
  async remove(id: string) {
    const foundExercise = await this.findOne(id);
    if (!foundExercise) throw new NotFoundException('Exercise not Found');
    return this.exerciseRepo.remove(foundExercise);
  }
}
