import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerSwitchRequest } from './entities/trainer-switch-request.entity';
import { User } from 'src/users/entities/user.entity';
import { roleType } from 'src/users/enum/user.enum';

@Injectable()
export class TrainerRequestsService {
  constructor(
    @InjectRepository(TrainerSwitchRequest)
    private requestRepo: Repository<TrainerSwitchRequest>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async requestTrainer(userId: string, trainerId: string) {
    if (userId === trainerId)
      throw new BadRequestException('Cannot request yourself as trainer');
    const trainer = await this.userRepo.findOne({
      where: { id: trainerId, role: roleType.TRAINER },
    });
    if (!trainer) throw new NotFoundException('Trainer not found');

    const existing = await this.requestRepo.findOne({
      where: { user: { id: userId }, status: 'PENDING' },
    });
    if (existing)
      throw new BadRequestException('You already have a pending request');
    const currentTrainer = await this.userRepo.findOne({
      where: { id: userId },
      relations: { trainer: true },
    });
    if (currentTrainer?.trainer?.id === trainerId)
      throw new BadRequestException('Already assigned to this trainer');
    const request = this.requestRepo.create({
      user: { id: userId },
      requestedTrainer: { id: trainerId },
      requestedByRole: 'USER',
    });
    return this.requestRepo.save(request);
  }

  async getPendingRequests(trainerId?: string, isAdmin = false) {
    const where = isAdmin
      ? { status: 'PENDING' as const }
      : { requestedTrainer: { id: trainerId }, status: 'PENDING' as const };
    return this.requestRepo.find({
      where,
      relations: { user: true, requestedTrainer: true, decidedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async decideRequest(
    requestId: string,
    deciderId: string,
    approve: boolean,
    deciderRole: roleType,
  ) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: { user: true, requestedTrainer: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== 'PENDING')
      throw new BadRequestException('Request already decided');
    if (
      deciderRole === roleType.TRAINER &&
      request.requestedTrainer.id !== deciderId
    )
      throw new BadRequestException('Not authorized to decide this request');
    request.status = approve ? 'APPROVED' : 'REJECTED';
    request.decidedAt = new Date();
    request.decidedBy = { id: deciderId } as User;
    await this.requestRepo.save(request);
    if (approve) {
      await this.userRepo.update(request.user.id, {
        trainer: { id: request.requestedTrainer.id },
      });
    }
    return request;
  }
  async getMyTrainer(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { trainer: true },
    });
    return user?.trainer ?? null;
  }
  async getTrainers() {
    return this.userRepo.find({
      where: { role: roleType.TRAINER },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }
  async getClients(trainerId: string) {
    return this.userRepo.find({
      where: { trainer: { id: trainerId } },
      relations: { trainer: true },
    });
  }
  async removeClient(trainerId: string, clientId: string) {
    const client = await this.userRepo.findOne({
      where: { id: clientId, trainer: { id: trainerId } },
      relations: { trainer: true },
    });
    if (!client) throw new NotFoundException('Client not assigned to you');
    client.trainer = null;
    await this.userRepo.save(client);
    return { message: 'Client unassigned successfully' };
  }
}
