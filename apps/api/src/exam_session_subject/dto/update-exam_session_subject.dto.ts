import { PartialType } from '@nestjs/swagger';
import { CreateExamSessionSubjectDto } from './create-exam_session_subject.dto';

export class UpdateExamSessionSubjectDto extends PartialType(CreateExamSessionSubjectDto) {}
