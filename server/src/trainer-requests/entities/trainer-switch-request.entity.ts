import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('trainer_switch_request')
export class TrainerSwitchRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (u) => u.trainerSwitchRequests, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'requested_trainer_id' })
  requestedTrainer: User;
  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  @Column({ type: 'varchar', length: 20, name: 'requested_by_role' })
  requestedByRole: 'USER' | 'TRAINER' | 'ADMIN';
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @Column({ type: 'timestamp', nullable: true, name: 'decided_at' })
  decidedAt: Date;
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'decided_by' })
  decidedBy: User;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
