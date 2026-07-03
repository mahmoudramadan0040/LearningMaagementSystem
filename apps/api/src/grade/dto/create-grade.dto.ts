import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class CreateGradeDto {

  total_score: any;
  semester_work_score: any;   
  final_exam_score: any;    


  @IsString()
  grade?: string;
  @IsString()
  grade_ar?: string;


  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsUUID()
  @IsNotEmpty()
  examSessionId: string;
}
