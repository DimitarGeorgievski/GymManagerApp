import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { roleType } from 'src/users/enum/user.enum';

@ApiTags('workout')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  @ApiResponse({ status: 201, description: 'Workout created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiBody({ type: CreateWorkoutDto })
  create(@Body() createWorkoutDto: CreateWorkoutDto, @Req() req) {
    return this.workoutService.create(createWorkoutDto, req.user.id);
  }

  @Roles(roleType.USER)
  @Get()
  @ApiOperation({ summary: 'Get all workouts for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of workouts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  findAll() {
    return this.workoutService.findAll();
  }

  @Roles(roleType.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Get workout by ID' })
  @ApiResponse({ status: 200, description: 'Workout found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'id', description: 'Workout ID' })
  findOne(@Param('id') id: string) {
    return this.workoutService.findOne(id);
  }

  @Roles(roleType.USER)
  @Get('/title/:title')
  @ApiOperation({ summary: 'Get workout by title' })
  @ApiResponse({ status: 200, description: 'Workout found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'title', description: 'Workout title' })
  findOneByTitle(@Param('title') title: string) {
    return this.workoutService.findOne(title);
  }

  @Roles(roleType.USER)
  @Get('/workouts/today')
  @ApiOperation({ summary: 'Get today\'s workouts for authenticated user' })
  @ApiResponse({ status: 200, description: 'Today\'s workouts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  getTodaysWorkouts(@Req() req) {
    return this.workoutService.getTodaysWorkouts(req.user.id);
  }

  @Roles(roleType.USER)
  @Get('/workouts/week')
  @ApiOperation({ summary: 'Get this week\'s workouts for authenticated user' })
  @ApiResponse({ status: 200, description: 'Weekly workouts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  getWeeklyWorkouts(@Req() req) {
    return this.workoutService.getWeeklyWorkouts(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workout' })
  @ApiResponse({ status: 200, description: 'Workout updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'id', description: 'Workout ID' })
  @ApiBody({ type: UpdateWorkoutDto })
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout' })
  @ApiResponse({ status: 200, description: 'Workout deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'id', description: 'Workout ID' })
  remove(@Param('id') id: string) {
    return this.workoutService.remove(id);
  }
}
