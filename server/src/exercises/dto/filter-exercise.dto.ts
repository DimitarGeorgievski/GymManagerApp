import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleGroup } from '../enum/exercise.enum';

export class ExerciseFilterDto {
  @ApiPropertyOptional({ example: 'bench press' })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiPropertyOptional({ enum: MuscleGroup, example: MuscleGroup.CHEST })
  @IsOptional()
  @IsEnum(MuscleGroup)
  muscleGroup?: MuscleGroup;
  @ApiPropertyOptional({ example: 0, minimum: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;
  @ApiPropertyOptional({ example: 20, minimum: 1, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take: number = 20;
}