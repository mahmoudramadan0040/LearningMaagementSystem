import { IsString, IsNotEmpty, IsUUID, IsInt, IsBoolean, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GradeType } from '../entities/subject.entity';
export class CreateSubjectDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'MATH101' })
  @IsString()
  @IsNotEmpty()
  subject_code: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  MaxScore: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  MinScore: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  IsAddedToTotal?: boolean;

  @ApiProperty({ example: 20 })
  @IsInt()
  final_min_score: number;

  @ApiProperty({ example: 70 })
  @IsInt()
  final_max_score: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  course_work_score: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  summer_final_min_score: number;

  @ApiProperty({ example: 60 })
  @IsInt()
  Summer_final_max_score: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  summer_course_work_score: number;

  @ApiProperty({ enum: GradeType, example: GradeType.NORMAL })
  @IsEnum(GradeType)
  grade_type: GradeType;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  @Max(100)
  pass_percentage: number;

  @ApiProperty({ example: 'a3f3d3a7-3e33-47f0-85aa-1b9c0e5f0d8f' })
  @IsUUID()
  departmentId: string;
}