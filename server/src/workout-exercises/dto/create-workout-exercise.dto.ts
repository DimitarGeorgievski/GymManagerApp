import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsNumber()
  sets: number;
  @IsNumber()
  reps: number;
  @IsOptional()
  @IsNumber()
  weightKg?: number;
  @IsOptional()
  @IsNumber()
  restSeconds?: number;
  @IsUUID()
  workoutId: string;
  @IsUUID()
  exerciseId: string;
}
