import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserSubjectDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  subjectId: string;
}
