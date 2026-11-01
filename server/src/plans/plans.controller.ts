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
} from '@nestjs/swagger';
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
    return this.plansService.create(createPlanDto, req.user.userId);
  }

  @Roles(roleType.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all training plans (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all training plans' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  findAll() {
    return this.plansService.findAll();
  }
  @Roles(roleType.USER, roleType.TRAINER, roleType.ADMIN)
  @Get('/my-plans')
  @ApiOperation({ summary: 'Get training plans for current user' })
  @ApiResponse({ status: 200, description: 'User training plans' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires USER, TRAINER, or ADMIN role',
  })
  findMyPlans(@Req() req) {
    return this.plansService.findUserPlans(req.user.userId);
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

  @Roles(roleType.TRAINER)
  @Get('trainer/clients/:clientId/plans')
  @ApiOperation({ summary: 'Get plans for a specific client (trainer only)' })
  @ApiResponse({ status: 200, description: 'Client training plans' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER role' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  getClientPlans(@Param('clientId') clientId: string, @Req() req) {
    return this.plansService.findClientPlans(req.user.userId, clientId);
  }

  @Roles(roleType.TRAINER)
  @Get('trainer/clients/:clientId/active-plan')
  @ApiOperation({ summary: 'Get active plan for a specific client (trainer only)' })
  @ApiResponse({ status: 200, description: 'Client active plan' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER role' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  getClientActivePlan(@Req() req, @Param('clientId') clientId: string) {
    return this.plansService.findClientActivePlan(req.user.userId, clientId);
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
  @ApiResponse({
    status: 200,
    description: 'Training plan updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiBody({ type: UpdatePlanDto })
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete training plan' })
  @ApiResponse({
    status: 200,
    description: 'Training plan deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires TRAINER or ADMIN role',
  })
  @ApiResponse({ status: 404, description: 'Training plan not found' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
  @Roles(roleType.TRAINER)
  @Post('trainer/clients/:clientId/assign-plan')
  @ApiOperation({ summary: 'Assign plan to client (trainer only)' })
  @ApiResponse({ status: 201, description: 'Plan assigned to client' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER role' })
  @ApiResponse({ status: 404, description: 'Client or plan not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiBody({ schema: { properties: { planId: { type: 'string' } } } })
  assignPlanToClient(
    @Req() req,
    @Param('clientId') clientId: string,
    @Body('planId') planId: string,
  ) {
    return this.plansService.assignPlanToClient(req.user.userId, clientId, planId);
  }

  @Roles(roleType.TRAINER)
  @Delete('trainer/clients/:clientId/plans/:planId')
  @ApiOperation({ summary: 'Remove plan from client (trainer only)' })
  @ApiResponse({ status: 200, description: 'Plan removed from client' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER role' })
  @ApiResponse({ status: 404, description: 'Client or plan not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  removePlanFromClient(
    @Req() req,
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
  ) {
    return this.plansService.removePlanFromClient(req.user.userId, clientId, planId);
  }
}
