import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @Min(1)
  durationMinutes: number;
  @IsDateString()
  date: string;
  @IsUUID()
  userId: string;
  @IsOptional()
  workoutExercises?: {
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg?: number;
    restSeconds?: number;
  }[];
}