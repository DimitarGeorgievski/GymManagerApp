import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerSwitchRequest } from './entities/trainer-switch-request.entity';
import { TrainerRequestsService } from './trainer-requests.service';
import { TrainerRequestsController } from './trainer-requests.controller';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerSwitchRequest, User]), UsersModule],
  providers: [TrainerRequestsService],
  controllers: [TrainerRequestsController],
  exports: [TrainerRequestsService],
})
export class TrainerRequestsModule {}