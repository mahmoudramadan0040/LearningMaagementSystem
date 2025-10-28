import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExamSessionDto {
  @ApiProperty({
    example: 'January',
    description: 'Session name (e.g., January, May, September)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2024/2025',
    description: 'Academic year for the session',
  })
  @IsString()
  @IsNotEmpty()
  academicYear: string;
}
