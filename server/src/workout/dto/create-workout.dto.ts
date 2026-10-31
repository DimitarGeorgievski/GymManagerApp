import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkoutExerciseInput {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID('4')
  exerciseId: string;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsNumber()
  @Min(1)
  sets: number;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsNumber()
  @Min(1)
  reps: number;
}

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Push Day Workout' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Upper body push exercises' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, minimum: 1 })
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ type: [WorkoutExerciseInput] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseInput)
  workoutExercises?: WorkoutExerciseInput[];
}