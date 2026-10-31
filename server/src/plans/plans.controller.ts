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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('plans')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Roles(roleType.USER)
  @Post()
  @ApiOperation({ summary: 'Create a new training plan' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiBody({ type: CreatePlanDto })
  create(@Body() createPlanDto: CreatePlanDto, @Req() req) {
    return this.plansService.create(createPlanDto, req.user.id);
  }

  @Roles(roleType.USER)
  @Get()
  @ApiOperation({ summary: 'Get all training plans for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of training plans' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  findAll() {
    return this.plansService.findAll();
  }

  @Roles(roleType.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Get training plan by ID' })
  @ApiResponse({ status: 200, description: 'Training plan found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }
  @Roles(roleType.USER)
  @Get('/user/:id')
  @ApiOperation({ summary: 'Get training plans for a specific user' })
  @ApiResponse({ status: 200, description: 'User training plans' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findUserPlans(@Param('id') id: string) {
    return this.plansService.findUserPlans(id);
  }
  @Roles(roleType.USER)
  @Get('/title/:title')
  @ApiOperation({ summary: 'Get training plan by title' })
  @ApiResponse({ status: 200, description: 'Training plan found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER role' })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'title', description: 'Plan title' })
  findOneByTitle(@Param('title') title: string) {
    return this.plansService.findOne(title);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update training plan' })
  @ApiResponse({ status: 200, description: 'Training plan updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiBody({ type: UpdatePlanDto })
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete training plan' })
  @ApiResponse({ status: 200, description: 'Training plan deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
