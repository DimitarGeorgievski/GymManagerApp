import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Workout } from 'src/workout/entities/workout.entity';

@Entity({
  name: 'workout_exercises',
})
export class WorkoutExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'integer' })
  sets: number;
  @Column({ type: 'integer' })
  reps: number;
  @Column({
    type: 'numeric',
    name: 'weight_kg',
    nullable: true,
  })
  weightKg?: number;
  @Column({
    type: 'integer',
    name: 'rest_seconds',
    nullable: true,
  })
  restSeconds?: number;
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
  @ManyToOne(() => Workout, (workout) => workout.workoutExercises, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;
  @ManyToOne(() => Exercise, (exercise) => exercise.workoutExercises, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
