import { User } from 'src/users/entities/user.entity';
import { WorkoutExercise } from 'src/workout-exercises/entities/workout-exercise.entity';
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

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({
    name: 'duration_minutes',
  })
  durationMinutes: number;
  @Column()
  date: Date;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.workouts)
  @JoinColumn({ name: 'user_id' })
  userId: User;
  @OneToMany(() => WorkoutExercise, (we) => we.workout, { cascade: true })
  workoutExercises: WorkoutExercise[];
}
