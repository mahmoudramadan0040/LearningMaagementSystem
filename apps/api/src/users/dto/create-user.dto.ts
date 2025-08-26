import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  MinLength,
} from 'class-validator';

import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  student_id?: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: true })
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  class_code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  national_id?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level_status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  Graduated?: boolean;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // departmentId?: string;
}