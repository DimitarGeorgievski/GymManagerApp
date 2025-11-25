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

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @Min(0)
  calories: number;
  @IsNumber()
  @Min(0)
  protein: number;
  @IsNumber()
  @Min(0)
  carbs: number;
  @IsNumber()
  @Min(0)
  fats: number;
  @IsUUID()
  userId: string;
}
