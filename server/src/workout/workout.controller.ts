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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
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
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER or ADMIN role',
  })
  @ApiBody({ type: CreateWorkoutDto })
  create(@Body() createWorkoutDto: CreateWorkoutDto, @Req() req) {
    return this.workoutService.create(createWorkoutDto, req.user.userId);
  }

  @Roles(roleType.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all workouts (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all workouts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  findAll() {
    return this.workoutService.findAll();
  }
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @Get('/my-workouts')
  @ApiOperation({ summary: 'Get workouts for current user' })
  @ApiResponse({ status: 200, description: 'User workouts' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires USER, TRAINER, or ADMIN role',
  })
  findMyWorkouts(@Req() req) {
    return this.workoutService.findByUser(req.user.userId);
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
  @ApiOperation({ summary: "Get today's workouts for authenticated user" })
  @ApiResponse({ status: 200, description: "Today's workouts" })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  getTodaysWorkouts(@Req() req) {
    return this.workoutService.getTodaysWorkouts(req.user.userId);
  }

  @Roles(roleType.USER)
  @Get('/workouts/week')
  @ApiOperation({ summary: "Get this week's workouts for authenticated user" })
  @ApiResponse({ status: 200, description: 'Weekly workouts' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  getWeeklyWorkouts(@Req() req) {
    return this.workoutService.getWeeklyWorkouts(req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workout' })
  @ApiResponse({ status: 200, description: 'Workout updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'id', description: 'Workout ID' })
  @ApiBody({ type: UpdateWorkoutDto })
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout' })
  @ApiResponse({ status: 200, description: 'Workout deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Workout not found' })
  @ApiParam({ name: 'id', description: 'Workout ID' })
  remove(@Param('id') id: string) {
    return this.workoutService.remove(id);
  }
  @Roles(roleType.TRAINER)
  @Get('trainer/clients/:clientId/workouts')
  @ApiOperation({
    summary: 'Get workouts for a specific client (trainer only)',
  })
  @ApiResponse({ status: 200, description: 'Client workouts' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER role',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  getClientWorkouts(@Req() req, @Param('clientId') clientId: string) {
    return this.workoutService.findClientWorkouts(req.user.userId, clientId);
  }
  @Roles(roleType.TRAINER)
  @Get('trainer/clients/:clientId/workouts/today')
  @ApiOperation({
    summary: "Get today's workouts for a specific client (trainer only)",
  })
  @ApiResponse({ status: 200, description: "Today's client workouts" })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER role',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  getClientTodaysWorkouts(@Req() req, @Param('clientId') clientId: string) {
    return this.workoutService.findClientTodaysWorkouts(
      req.user.userId,
      clientId,
    );
  }
  @Roles(roleType.TRAINER)
  @Get('trainer/clients/:clientId/workouts/week')
  @ApiOperation({
    summary: "Get this week's workouts for a specific client (trainer only)",
  })
  @ApiResponse({ status: 200, description: 'Weekly client workouts' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER role',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  getClientWeeklyWorkouts(@Req() req, @Param('clientId') clientId: string) {
    return this.workoutService.findClientWeeklyWorkouts(
      req.user.userId,
      clientId,
    );
  }
  @Roles(roleType.TRAINER)
  @Post('trainer/clients/:clientId/assign-workout')
  @ApiOperation({ summary: 'Assign workout to client (trainer only)' })
  @ApiResponse({ status: 201, description: 'Workout assigned successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER role',
  })
  @ApiResponse({ status: 404, description: 'Client or workout not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiBody({ schema: { properties: { workoutId: { type: 'string' } } } })
  assignWorkoutToClient(
    @Req() req,
    @Param('clientId') clientId: string,
    @Body('workoutId') workoutId: string,
  ) {
    return this.workoutService.assignWorkoutToClient(
      req.user.userId,
      clientId,
      workoutId,
    );
  }

  @Roles(roleType.TRAINER)
  @Delete('trainer/clients/:clientId/workouts/:workoutId')
  @ApiOperation({ summary: 'Remove workout from client (trainer only)' })
  @ApiResponse({ status: 200, description: 'Workout removed from client' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER role',
  })
  @ApiResponse({ status: 404, description: 'Client or workout not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiParam({ name: 'workoutId', description: 'Workout ID' })
  removeWorkoutFromClient(
    @Req() req,
    @Param('clientId') clientId: string,
    @Param('workoutId') workoutId: string,
  ) {
    return this.workoutService.removeWorkoutFromClient(
      req.user.userId,
      clientId,
      workoutId,
    );
  }
}
