import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutExerciseDto {
  @ApiProperty({ example: 3, minimum: 1 })
  @IsNumber()
  sets: number;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsNumber()
  reps: number;

  @ApiPropertyOptional({ example: 20.5, minimum: 0 })
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional({ example: 90, minimum: 0 })
  @IsOptional()
  @IsNumber()
  restSeconds?: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  workoutId: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012' })
  @IsUUID()
  exerciseId: string;
}
