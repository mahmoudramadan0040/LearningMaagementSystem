import { PartialType } from '@nestjs/swagger';
import { CreateSubjectMaterialDto } from './create-subject_material.dto';

export class UpdateSubjectMaterialDto extends PartialType(CreateSubjectMaterialDto) {}
