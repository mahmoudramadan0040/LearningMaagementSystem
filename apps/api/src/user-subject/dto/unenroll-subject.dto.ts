import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnenrollSubjectDto {
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;
}
