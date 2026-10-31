import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, roleType } from '../enum/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  firstName: string;
  @ApiProperty({ example: 'Doe', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  lastName: string;
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '+1234567890', minLength: 7, maxLength: 20 })
  @IsString()
  @Length(7, 20)
  phoneNumber: string;
  @ApiProperty({ example: 'securePassword123', minLength: 6, maxLength: 50 })
  @IsString()
  @Length(6, 50)
  password: string;
  @ApiProperty({ example: 80, minimum: 30, maximum: 300 })
  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg: number;
  @ApiProperty({ example: 180, minimum: 100, maximum: 250 })
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;
  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
  @ApiPropertyOptional({ enum: roleType, example: roleType.USER })
  @IsEnum(roleType)
  @IsOptional()
  role?: roleType;
}
