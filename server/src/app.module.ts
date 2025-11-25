import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutExercisesModule } from './workout-exercises/workout-exercises.module';
import { FoodModule } from './food/food.module';
import { PlansModule } from './plans/plans.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }), UsersModule, ExercisesModule, WorkoutModule, WorkoutExercisesModule, FoodModule, PlansModule, AuthModule,
  
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
