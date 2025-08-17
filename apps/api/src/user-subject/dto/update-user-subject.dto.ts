import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSubjectDto } from './create-user-subject.dto';

export class UpdateUserSubjectDto extends PartialType(CreateUserSubjectDto) {}
