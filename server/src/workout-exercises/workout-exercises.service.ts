import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateCodes } from 'src/duplicateCodes';
import { UpdateWorkoutDto } from 'src/workout/dto/update-workout.dto';
import { Repository } from 'typeorm';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';

@Injectable()
export class WorkoutExercisesService {
  constructor(
    @InjectRepository(WorkoutExercise)
    private workoutExerciseRepo: Repository<WorkoutExercise>,
  ) {}
  async create(createData: CreateWorkoutExerciseDto) {
    try {
      const newWorkout = await this.workoutExerciseRepo.save({
        ...createData,
        workout: { id: createData.exerciseId },
        exercise: { id: createData.exerciseId },
      });
      return newWorkout;
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'workout exercise with these informations already exist',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }
  findAll() {
    return this.workoutExerciseRepo.find({});
  }
  async findOne(id: string) {
    try {
      const foundWorkoutExercise =
        await this.workoutExerciseRepo.findOneByOrFail({ id });
      return foundWorkoutExercise;
    } catch (error) {
      throw new NotFoundException('workout exercise not found');
    }
  }
  async update(id: string, data: UpdateWorkoutExerciseDto) {
    try {
      const foundWorkoutExercise = await this.findOne(id);
      Object.assign(foundWorkoutExercise, data);
      await this.workoutExerciseRepo.save({
        ...data,
        workout: { id: data.workoutId },
        exercise: { id: data.exerciseId },
      });
    } catch (error) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE)
        throw new BadRequestException(
          'Got Issue with updating this workout exercise',
        );
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async remove(id: string) {
    const foundWorkoutExercise = await this.findOne(id);
    if (!foundWorkoutExercise)
      throw new NotFoundException('workout exercise not Found');
    return this.workoutExerciseRepo.remove(foundWorkoutExercise);
  }
}
