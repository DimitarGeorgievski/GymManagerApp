import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MuscleGroup } from '../enum/exercise.enum';
import { WorkoutExercise } from 'src/workout-exercises/entities/workout-exercise.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Index('idx_exercises_created_by', ['createdBy'])
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({
    type: 'varchar',
    length: 50,
    name: 'muscle_group',
  })
  muscleGroup: MuscleGroup;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  equipment?: string;
  @Column({ type: 'text' })
  description: string;
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
  @OneToMany(() => WorkoutExercise, (we) => we.exercise)
  workoutExercises: WorkoutExercise[];
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
