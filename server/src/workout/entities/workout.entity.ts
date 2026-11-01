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
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'integer', name: 'duration_minutes' })
  durationMinutes: number;
  @Column({ type: 'date' })
  date: Date;
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
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;
  @OneToMany(() => WorkoutExercise, (we) => we.workout, { cascade: true })
  workoutExercises: WorkoutExercise[];
}
