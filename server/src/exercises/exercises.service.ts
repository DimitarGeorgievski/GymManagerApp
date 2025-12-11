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

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
  ) {}
  async create(createData: CreateExerciseDto) {
    try {
      const foundExercise = await this.findOneByName(createData.name);
      if (foundExercise)
        throw new BadRequestException('Exercise with this name already exists');
      const newExercise = await this.exerciseRepo.save(createData);
      return newExercise;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Exercise with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }

  findAll(filters: ExerciseFilterDto) {
    const queryBuilder = this.exerciseRepo.createQueryBuilder();
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
      relations: {
        workoutExercises: true,
      },
    });
    if (!foundExercise)
      throw new NotFoundException("Exercise with this name doesn't exist");
    return foundExercise;
  }
  async update(id: string, data: UpdateExerciseDto) {
    try {
      const foundExercise = await this.findOne(id);
      Object.assign(foundExercise, data);
      await this.exerciseRepo.save({
        ...data,
      });
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this Exercise');
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundExercise = await this.findOne(id);
    if (!foundExercise) throw new NotFoundException('Exercise not Found');
    return this.exerciseRepo.remove(foundExercise);
  }
}
