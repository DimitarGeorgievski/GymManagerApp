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
import { Between, Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
  ) {}
  async create(createData: CreateWorkoutDto, userId: string) {
    try {
      const foundWorkout = await this.findOneByTitle(createData.title);
      if (foundWorkout)
        throw new BadRequestException('Workout with this name already exists');
      const newWorkout = await this.workoutRepo.save({
        ...createData,
        userId: { id: userId },
        workoutExercises: createData.workoutExercises?.map((we) => ({
          exerciseId: we.exerciseId,
          sets: we.sets,
          reps: we.reps,
        })),
      });
      return newWorkout;
    } catch (error:any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Workout with these informations already exist',
        );
      throw new InternalServerErrorException(error.message);
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
  async getTodaysWorkouts(userId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return this.workoutRepo.find({
      where: {
        userId: { id: userId },
        date: Between(start, end),
      },
      relations: ['workoutExercises', 'workoutExercises.exercise'],
    });
  }
  async getWeeklyWorkouts(userId: string) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return this.workoutRepo.find({
      where: {
        userId: { id: userId },
        date: Between(startOfWeek, endOfWeek),
      },
      relations: ['workoutExercises', 'workoutExercises.exercise'],
    });
  }
  async findOneByTitle(title: string) {
    const foundWorkout = await this.workoutRepo.findOne({
      where: { title },
      relations: {
        workoutExercises: true,
      },
    });
    return foundWorkout;
  }
  async update(id: string, data: UpdateWorkoutDto) {
    try {
      const foundWorkout = await this.findOne(id);
      Object.assign(foundWorkout, data);
      await this.workoutRepo.save({
        ...data,
        workoutExercises: data.workoutExercises?.map((we) => ({
          exerciseId: we.exerciseId,
          sets: we.sets,
          reps: we.reps,
        })),
      });
    } catch (error:any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException('Got Issue with updating this Workout');
      throw new InternalServerErrorException(error.message);
    }
  }
  async remove(id: string) {
    const foundWorkout = await this.findOne(id);
    if (!foundWorkout) throw new NotFoundException('Workout not Found');
    return this.workoutRepo.remove(foundWorkout);
  }
}
