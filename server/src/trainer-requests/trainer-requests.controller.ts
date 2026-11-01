import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrainerRequestsService } from './trainer-requests.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';

@ApiTags('trainer-requests')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('trainer-requests')
export class TrainerRequestsController {
  constructor(
    private readonly trainerRequestsService: TrainerRequestsService,
  ) {}

  @Roles(roleType.USER)
  @Get('trainers')
  @ApiOperation({ summary: 'List available trainers' })
  @ApiResponse({ status: 200, description: 'List of trainers' })
  async getTrainers() {
    return this.trainerRequestsService.getTrainers();
  }

  @Roles(roleType.USER)
  @Get('my-trainer')
  @ApiOperation({ summary: 'Get my assigned trainer' })
  @ApiResponse({ status: 200, description: 'Assigned trainer' })
  async getMyTrainer(@Req() req) {
    return this.trainerRequestsService.getMyTrainer(req.user.userId);
  }

  @Roles(roleType.USER)
  @Post('request')
  @ApiOperation({ summary: 'Request trainer assignment/switch' })
  @ApiResponse({ status: 201, description: 'Request created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  @ApiBody({ schema: { properties: { trainerId: { type: 'string' } } } })
  async requestTrainer(@Req() req, @Body('trainerId') trainerId: string) {
    return this.trainerRequestsService.requestTrainer(
      req.user.userId,
      trainerId,
    );
  }

  @Roles(roleType.TRAINER, roleType.ADMIN)
  @Get('pending')
  @ApiOperation({ summary: 'Get pending trainer requests' })
  @ApiResponse({ status: 200, description: 'List of pending requests' })
  async getPendingRequests(@Req() req, @Query('all') all?: string) {
    const isAdmin = req.user.role === roleType.ADMIN;
    return this.trainerRequestsService.getPendingRequests(
      isAdmin ? undefined : req.user.userId,
      isAdmin,
    );
  }

  @Roles(roleType.TRAINER, roleType.ADMIN)
  @Patch('pending/:id')
  @ApiOperation({ summary: 'Approve or reject trainer request' })
  @ApiResponse({ status: 200, description: 'Request decided' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiBody({ schema: { properties: { approve: { type: 'boolean' } } } })
  async decideRequest(
    @Param('id') id: string,
    @Body('approve') approve: boolean,
    @Req() req,
  ) {
    return this.trainerRequestsService.decideRequest(
      id,
      req.user.userId,
      approve,
      req.user.role,
    );
  }

  @Roles(roleType.TRAINER)
  @Get('clients')
  @ApiOperation({ summary: 'Get assigned clients' })
  @ApiResponse({ status: 200, description: 'List of clients' })
  async getClients(@Req() req) {
    return this.trainerRequestsService.getClients(req.user.userId);
  }

  @Roles(roleType.TRAINER)
  @Delete('clients/:clientId')
  @ApiOperation({ summary: 'Remove client (unassign trainer)' })
  @ApiResponse({ status: 200, description: 'Client unassigned successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  async removeClient(@Req() req, @Param('clientId') clientId: string) {
    return this.trainerRequestsService.removeClient(req.user.userId, clientId);
  }
}
