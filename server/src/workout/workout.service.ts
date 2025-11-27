import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
  ) {}
  async create(createData: CreateWorkoutDto) {
    try {
      const foundWorkout = await this.findOneByTitle(createData.title);
      if (foundWorkout)
        throw new BadRequestException('Workout with this name already exists');
      const newWorkout = await this.workoutRepo.save({
        ...createData,
        userId: { id: createData.userId },
        workoutExercises: createData.workoutExercises?.map((id) => ({ id })),
      });
      return newWorkout;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Workout with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }
  findAll() {
    return this.workoutRepo.find({});
  }
  async findOne(id: string) {
    try {
      const foundWorkout = await this.workoutRepo.findOneByOrFail({ id });
      return foundWorkout;
    } catch (error) {
      throw new NotFoundException('Workout not found');
    }
  }
  async findOneByTitle(title: string) {
    const foundWorkout = await this.workoutRepo.findOne({
      where: { title },
      relations: {
        workoutExercises: true,
      },
    });
    if (!foundWorkout)
      throw new NotFoundException("Workout with this name doesn't exist");
    return foundWorkout;
  }
  async update(id: string, data: UpdateWorkoutDto) {
    try {
      const foundWorkout = await this.findOne(id);
      Object.assign(foundWorkout, data);
      await this.workoutRepo.save({
        ...data,
        userId: { id: data.userId },
        workoutExercises: data.workoutExercises?.map((id) => ({ id })),
      });
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this Workout');
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundWorkout = await this.findOne(id);
    if (!foundWorkout) throw new NotFoundException('Workout not Found');
    return this.workoutRepo.remove(foundWorkout);
  }
}
