import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Workout } from 'src/workout/entities/workout.entity';

@Entity()
export class WorkoutExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  sets: number;
  @Column()
  reps: number;
  @Column({ type: 'numeric', name: 'weight_kg', nullable: true })
  weightKg?: number;
  @Column({ type: 'int', name: 'rest_seconds', nullable: true })
  restSeconds?: number;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @ManyToOne(() => Workout, (workout) => workout.workoutExercises)
  workout: Workout;
  @ManyToOne(() => Exercise, (exercise) => exercise.workoutExercises)
  exercise: Exercise;
}
