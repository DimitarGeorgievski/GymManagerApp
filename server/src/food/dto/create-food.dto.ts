import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDateString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export class CreateFoodDto {
  @ApiProperty({ example: 'Chicken Breast' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 165, minimum: 0 })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 31, minimum: 0 })
  @IsNumber()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 0, minimum: 0 })
  @IsNumber()
  @Min(0)
  carbs: number;

  @ApiProperty({ example: 3.6, minimum: 0 })
  @IsNumber()
  @Min(0)
  fats: number;
}
