import { PartialType } from '@nestjs/swagger';
import { CreateSubjectRoleDto } from './create-subject_role.dto';

export class UpdateSubjectRoleDto extends PartialType(CreateSubjectRoleDto) {}
