import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plans {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;
  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 6,
  })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.plans, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
