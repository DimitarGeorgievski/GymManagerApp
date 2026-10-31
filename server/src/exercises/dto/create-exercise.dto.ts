import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleGroup } from '../enum/exercise.enum';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Bench Press', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name: string;
  @ApiProperty({ enum: MuscleGroup, example: MuscleGroup.CHEST })
  @IsEnum(MuscleGroup)
  muscleGroup: MuscleGroup;
  @ApiPropertyOptional({ example: 'Barbell', minLength: 2, maxLength: 100 })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  equipment?: string;
  @ApiProperty({
    example: 'Lie on bench, lower bar to chest, press up',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @Length(5, 500)
  description: string;
}
