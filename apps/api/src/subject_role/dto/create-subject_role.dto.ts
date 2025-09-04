import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateSubjectRoleDto {
  @ApiProperty({ example: 1, description: 'ID of the subject' })
  @IsInt()
  subjectId: number;

  @ApiProperty({ example: 'A', description: 'Grade letter (A, B, C, ...)' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ example: 85, description: 'Percentage threshold for the grade' })
  @Min(0)
  @Max(100)
  minPercentage: number;

  @ApiProperty({ example: 85, description: 'Percentage threshold for the grade' })
  @Min(0)
  @Max(100)
  maxPercentage: number;
}
