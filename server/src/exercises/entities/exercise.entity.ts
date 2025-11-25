import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MuscleGroup } from '../enum/exercise.enum';
import { WorkoutExercise } from 'src/workout-exercises/entities/workout-exercise.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: MuscleGroup,
    name: 'muscle_group',
  })
  muscleGroup: MuscleGroup;
  @Column({ nullable: true })
  equipment?: string;
  @Column()
  description: string;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @OneToMany(() => WorkoutExercise, we => we.exercise)
  workoutExercises: WorkoutExercise[]
}
