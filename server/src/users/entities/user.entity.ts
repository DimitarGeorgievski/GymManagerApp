import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender, roleType } from '../enum/user.enum';
import { Food } from 'src/food/entities/food.entity';
import { Plans } from 'src/plans/entities/plan.entity';
import { Workout } from 'src/workout/entities/workout.entity';

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
  @Column()
  password: string;
  @Column({
    name: 'weight_kg',
    type: 'float',
  })
  weightKg: number;
  @Column({
    name: 'height_cm',
  })
  heightCm: number;
  @Column({
    type: 'enum',
    enum: roleType,
    default: roleType.USER,
  })
  role: roleType;
  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate: Date;
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
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
  @OneToMany(() => Plans, (plans) => plans.userId)
  plans: Plans[];
  @OneToMany(() => Workout, (workout) => workout.userId)
  workouts: Workout[];
}
