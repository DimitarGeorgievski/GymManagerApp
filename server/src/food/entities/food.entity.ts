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
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  calories: number;
  @Column({
    type: 'numeric',
  })
  protein: number;
  @Column({
    type: 'numeric',
  })
  carbs: number;
  @Column({
    type: 'numeric',
  })
  fats: number;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @ManyToOne(() => User, (User) => User.foods)
  @JoinColumn({ name: 'user_id' })
  userId: User;
}
