import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}
