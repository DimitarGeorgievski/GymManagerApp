import { Module } from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutExercise]), UsersModule],
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService],
})
export class WorkoutExercisesModule {}
