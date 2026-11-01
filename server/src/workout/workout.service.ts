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
import { User } from 'src/users/entities/user.entity';
import { roleType } from 'src/users/enum/user.enum';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createData: CreateWorkoutDto, userId: string) {
    try {
      const foundWorkout = await this.findOneByTitle(createData.title);
      if (foundWorkout) {
        throw new BadRequestException('Workout with this name already exists');
      }
      const workoutToSave = {
        ...createData,
        userId: { id: userId },
        workoutExercises: createData.workoutExercises?.map((we) => ({
          exercise: { id: we.exerciseId },
          sets: we.sets,
          reps: we.reps,
        })),
      };
      const newWorkout = await this.workoutRepo.save(workoutToSave);
      return newWorkout;
    } catch (error: any) {
      if (error.code === DuplicateCodes.DUPLICATE_PG_CODE) {
        throw new BadRequestException(
          'Workout with these informations already exist',
        );
      }
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
      relations: {
        workoutExercises: {
          workout: true,
        },
      },
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
  async findByUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { trainer: true },
    });
    if (!user) throw new NotFoundException('user doesnt exist');
    const trainerId = user.role === roleType.TRAINER || user.role === roleType.ADMIN
      ? userId
      : user.trainer?.id;
    if (!trainerId) throw new NotFoundException("trainer doesnt exist");
    return this.workoutRepo.find({
      where: { userId: { id: trainerId } },
      relations: { workoutExercises: { exercise: true } },
    });
  }
  async update(id: string, data: UpdateWorkoutDto) {
    try {
      const foundWorkout = await this.findOne(id);
      Object.assign(foundWorkout, data);
      await this.workoutRepo.save({
        ...data,
        workoutExercises: data.workoutExercises?.map((we) => ({
          exercise: { id: we.exerciseId },
          sets: we.sets,
          reps: we.reps,
        })),
      });
    } catch (error: any) {
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
  async findClientWorkouts(trainerId: string, clientId: string) {
    const workouts = await this.workoutRepo
      .createQueryBuilder('workout')
      .innerJoin('workout.userId', 'client')
      .innerJoin('client.trainer', 'trainer')
      .where('trainer.id = :trainerId', { trainerId })
      .andWhere('client.id = :clientId', { clientId })
      .leftJoinAndSelect('workout.workoutExercises', 'workoutExercises')
      .leftJoinAndSelect('workoutExercises.exercise', 'exercise')
      .orderBy('workout.date', 'DESC')
      .getMany();
    if (!workouts.length) {
      const client = await this.userRepo.findOne({
        where: { id: clientId, trainer: { id: trainerId } },
      });
      if (!client) throw new NotFoundException('Client not assigned to you');
    }
    return workouts;
  }
  async findClientTodaysWorkouts(trainerId: string, clientId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const workouts = await this.workoutRepo
      .createQueryBuilder('workout')
      .innerJoin('workout.userId', 'client')
      .innerJoin('client.trainer', 'trainer')
      .where('trainer.id = :trainerId', { trainerId })
      .andWhere('client.id = :clientId', { clientId })
      .andWhere('workout.date BETWEEN :start AND :end', { start, end })
      .leftJoinAndSelect('workout.workoutExercises', 'workoutExercises')
      .leftJoinAndSelect('workoutExercises.exercise', 'exercise')
      .getMany();
    if (!workouts.length) {
      const client = await this.userRepo.findOne({
        where: { id: clientId, trainer: { id: trainerId } },
      });
      if (!client) throw new NotFoundException('Client not assigned to you');
    }
    return workouts;
  }
  async findClientWeeklyWorkouts(trainerId: string, clientId: string) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const workouts = await this.workoutRepo
      .createQueryBuilder('workout')
      .innerJoin('workout.userId', 'client')
      .innerJoin('client.trainer', 'trainer')
      .where('trainer.id = :trainerId', { trainerId })
      .andWhere('client.id = :clientId', { clientId })
      .andWhere('workout.date BETWEEN :start AND :end', { start: startOfWeek, end: endOfWeek })
      .leftJoinAndSelect('workout.workoutExercises', 'workoutExercises')
      .leftJoinAndSelect('workoutExercises.exercise', 'exercise')
      .getMany();
    if (!workouts.length) {
      const client = await this.userRepo.findOne({
        where: { id: clientId, trainer: { id: trainerId } },
      });
      if (!client) throw new NotFoundException('Client not assigned to you');
    }
    return workouts;
  }
  async assignWorkoutToClient(trainerId: string, clientId: string, workoutId: string) {
    const client = await this.userRepo.findOne({
      where: { id: clientId, trainer: { id: trainerId } },
    });
    if (!client) throw new NotFoundException('Client not assigned to you');
    const workout = await this.findOne(workoutId);
    if (!workout) throw new NotFoundException('Workout not found');
    const workoutDate = new Date();
    workoutDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workoutDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingWorkout = await this.workoutRepo.findOne({
      where: {
        userId: { id: clientId },
        date: Between(workoutDate, endOfDay),
      },
    });
    if (existingWorkout) {
      throw new BadRequestException(
        `Client already has a workout scheduled for today: "${existingWorkout.title}"`
      );
    }
    const clientWorkout = this.workoutRepo.create({
      title: workout.title,
      description: workout.description,
      durationMinutes: workout.durationMinutes,
      date: workoutDate,
      userId: { id: clientId },
      workoutExercises: workout.workoutExercises?.map((we) => ({
        exercise: we.exercise,
        sets: we.sets,
        reps: we.reps,
      })),
    });
    return this.workoutRepo.save(clientWorkout);
  }

  async removeWorkoutFromClient(trainerId: string, clientId: string, workoutId: string) {
    const client = await this.userRepo.findOne({
      where: { id: clientId, trainer: { id: trainerId } },
    });
    if (!client) throw new NotFoundException('Client not assigned to you');
    const workout = await this.workoutRepo.findOne({
      where: { id: workoutId, userId: { id: clientId } },
    });
    if (!workout) throw new NotFoundException('Workout not found for this client');
    return this.workoutRepo.remove(workout);
  }
}
