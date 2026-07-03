import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateSubjectRoleDto {
  @ApiProperty({ example: 1, description: 'ID of the subject' })
  @IsString()
  subjectId: number;

  @ApiProperty({
    example: 'total',
    description: 'Rule type: total or exam only or other like cheat or excuse',
  })
  @IsString()
  @IsNotEmpty()
  ruleType: string;

  @ApiProperty({ example: 'A', description: 'Grade letter (A, B, C, ...)' })
  @IsString()
  @IsNotEmpty()
  symbol: string;
  @ApiProperty({ example: 'جـ', description: 'Grade letter (A, B, C, ...)' })
  @IsString()
  @IsNotEmpty()
  symbol_ar: string;
  @ApiProperty({
    example: 85,
    description: 'Percentage threshold for the grade',
  })
  @Min(0)
  @Max(100)
  minPercentage: number;

  @ApiProperty({
    example: 85,
    description: 'Percentage threshold for the grade',
  })
  @Min(0)
  @Max(100)
  maxPercentage: number;
}
