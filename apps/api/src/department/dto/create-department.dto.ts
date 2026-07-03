import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Computer Science',
    description: 'Name of the department',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  name_ar: string;

  @ApiProperty({
    example: 'Industry and energy Faculty',
    description: 'Faculty to which the department belongs',
  })
  @IsNotEmpty()
  @IsString()
  Faculty: string;
  @ApiProperty({
    example: 'Industry and energy Faculty',
    description: 'Faculty to which the department belongs',
  })
  @IsNotEmpty()
  @IsString()
  Faculty_ar: string;
}
