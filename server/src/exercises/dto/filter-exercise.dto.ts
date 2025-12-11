import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { MuscleGroup } from '../enum/exercise.enum';

export class ExerciseFilterDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsEnum(MuscleGroup)
  muscleGroup?: MuscleGroup;
  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;
  @IsOptional()
  @IsInt()
  @Min(1)
  take: number = 20;
}