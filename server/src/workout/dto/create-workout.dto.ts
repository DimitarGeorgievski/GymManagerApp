import {
  IsArray,
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
  userId?: string;
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  workoutExercises?: string[];
}