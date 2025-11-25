import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { MuscleGroup } from '../enum/exercise.enum';

export class CreateExerciseDto {
  @IsString()
  @Length(2, 100)
  name: string;
  @IsEnum(MuscleGroup)
  muscleGroup: MuscleGroup;
  @IsString()
  @IsOptional()
  @Length(2, 100)
  equipment?: string;
  @IsString()
  @Length(5, 500)
  description: string;
}
