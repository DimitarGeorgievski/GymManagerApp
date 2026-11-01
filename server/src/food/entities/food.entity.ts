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
  @Column({ type: 'varchar', length: 255 })
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
  @ManyToOne(() => User, (user) => user.foods, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;
}
