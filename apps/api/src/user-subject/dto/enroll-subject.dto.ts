import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnrollSubjectDto {
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;
}
