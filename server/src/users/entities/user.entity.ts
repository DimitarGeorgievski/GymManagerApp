import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender, roleType } from '../enum/user.enum';
import { Food } from 'src/food/entities/food.entity';
import { Plans } from 'src/plans/entities/plan.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import { TrainerSwitchRequest } from 'src/trainer-requests/entities/trainer-switch-request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 100,
    name: 'first_name',
  })
  firstName: string;
  @Column({
    length: 100,
    name: 'last_name',
  })
  lastName: string;
  @Column({
    length: 150,
    unique: true,
  })
  email: string;
  @Column({
    length: 20,
    unique: true,
    name: 'phone_number',
  })
  phoneNumber: string;
  @Exclude()
  @Exclude()
  @Column({ type: 'text' })
  password: string;
  @Column({
    name: 'weight_kg',
    type: 'float',
  })
  weightKg: number;
  @Column({ name: 'height_cm', type: 'integer' })
  heightCm: number;
  @Column({
    type: 'varchar',
    length: 20,
    default: roleType.USER,
  })
  role: roleType;
  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  gender: Gender;
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
  @Exclude()
  @Column('text', {
    array: true,
    default: [],
    name: 'refresh_tokens',
  })
  refreshTokens: string[];
  @OneToMany(() => Food, (food) => food.userId)
  foods: Food[];
  @OneToMany(() => Plans, (plans) => plans.user)
  plans: Plans[];
  @OneToMany(() => Workout, (workout) => workout.userId)
  workouts: Workout[];
  @ManyToOne(() => User, (u) => u.clients, { nullable: true })
  @JoinColumn({ name: 'trainer_id' })
  trainer: User | null;
  @OneToMany(() => User, (u) => u.trainer)
  clients: User[];
  @OneToMany(() => TrainerSwitchRequest, (r) => r.user)
  trainerSwitchRequests: TrainerSwitchRequest[];
}
