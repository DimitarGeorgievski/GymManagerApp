import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutExercisesService } from './workout-exercises.service';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { roleType } from 'src/users/enum/user.enum';

@ApiTags('workout-exercises')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('workout-exercises')
export class WorkoutExercisesController {
  constructor(private readonly workoutExercisesService: WorkoutExercisesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout exercise' })
  @ApiResponse({ status: 201, description: 'Workout exercise created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiBody({ type: CreateWorkoutExerciseDto })
  create(@Body() createWorkoutExerciseDto: CreateWorkoutExerciseDto) {
    return this.workoutExercisesService.create(createWorkoutExerciseDto);
  }

  @Roles(roleType.USER)
  @Get()
  @ApiOperation({ summary: 'Get all workout exercises' })
  @ApiResponse({ status: 200, description: 'List of workout exercises' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  findAll() {
    return this.workoutExercisesService.findAll();
  }

  @Roles(roleType.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Get workout exercise by ID' })
  @ApiResponse({ status: 200, description: 'Workout exercise found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiResponse({ status: 404, description: 'Workout exercise not found' })
  @ApiParam({ name: 'id', description: 'Workout exercise ID' })
  findOne(@Param('id') id: string) {
    return this.workoutExercisesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workout exercise' })
  @ApiResponse({ status: 200, description: 'Workout exercise updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Workout exercise not found' })
  @ApiParam({ name: 'id', description: 'Workout exercise ID' })
  @ApiBody({ type: UpdateWorkoutExerciseDto })
  update(@Param('id') id: string, @Body() updateWorkoutExerciseDto: UpdateWorkoutExerciseDto) {
    return this.workoutExercisesService.update(id, updateWorkoutExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout exercise' })
  @ApiResponse({ status: 200, description: 'Workout exercise deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Workout exercise not found' })
  @ApiParam({ name: 'id', description: 'Workout exercise ID' })
  remove(@Param('id') id: string) {
    return this.workoutExercisesService.remove(id);
  }
}
