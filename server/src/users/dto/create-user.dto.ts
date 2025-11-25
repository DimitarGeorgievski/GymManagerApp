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
import { Gender, roleType } from '../enum/user.enum';

export class CreateUserDto {
  @IsString()
  @Length(2, 100)
  firstName: string;
  @IsString()
  @Length(2, 100)
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(7, 20)
  phoneNumber: string;
  @IsString()
  @Length(6, 50)
  password: string;
  @IsNumber()
  @Min(30)
  @Max(300)
  weightKg: number;
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;
  @IsEnum(roleType)
  @IsOptional()
  role?: roleType;
  @IsDateString()
  @IsOptional()
  birthDate?: string;
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
