import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { roleType } from 'src/users/enum/user.enum';

@UseGuards(AuthGuard, RoleGuard)
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('workout-exercises')
export class WorkoutExercisesController {
  constructor(private readonly workoutExercisesService: WorkoutExercisesService) {}

  @Post()
  create(@Body() createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    return this.workoutExercisesService.create(createWorkoutExerciseDto);
  }
  @Roles(roleType.USER)
  @Get()
  findAll() {
    return this.workoutExercisesService.findAll();
  }
  
  @Roles(roleType.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutExercisesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    return this.workoutExercisesService.update(id, updateWorkoutExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutExercisesService.remove(id);
  }
}
