import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateIf,
  IsUUID,
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
  level?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  Graduated?: boolean;

  @ApiProperty()
  @IsUUID()
  departmentId: string;
}
