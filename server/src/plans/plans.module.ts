import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { UsersModule } from 'src/users/users.module';
import { Plans } from './entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Plans]), UsersModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
