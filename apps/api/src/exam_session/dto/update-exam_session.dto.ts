import { PartialType } from '@nestjs/swagger';
import { CreateExamSessionDto } from './create-exam_session.dto';

export class UpdateExamSessionDto extends PartialType(CreateExamSessionDto) {}
