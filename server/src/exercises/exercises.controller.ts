import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';
import { ExerciseFilterDto } from './dto/filter-exercise.dto';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, description: 'Exercise created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiBody({ type: CreateExerciseDto })
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }
  @Get()
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @ApiOperation({ summary: 'Get all exercises with optional filters' })
  @ApiResponse({ status: 200, description: 'List of exercises' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
  @ApiQuery({ name: 'muscleGroup', required: false, description: 'Filter by muscle group' })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Filter by difficulty' })
  @ApiQuery({ name: 'equipment', required: false, description: 'Filter by equipment' })
  findAll(@Query() filters: ExerciseFilterDto) {
    return this.exercisesService.findAll(filters);
  }
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by ID' })
  @ApiResponse({ status: 200, description: 'Exercise found' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @Get('/name/:name')
  @ApiOperation({ summary: 'Get exercise by name' })
  @ApiResponse({ status: 200, description: 'Exercise found' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiParam({ name: 'name', description: 'Exercise name' })
  findOneByName(@Param('name') name: string) {
    return this.exercisesService.findOneByName(name);
  }
  @Roles(roleType.ADMIN, roleType.TRAINER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update exercise' })
  @ApiResponse({ status: 200, description: 'Exercise updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  @ApiBody({ type: UpdateExerciseDto })
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }
  @Roles(roleType.ADMIN, roleType.TRAINER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete exercise' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
