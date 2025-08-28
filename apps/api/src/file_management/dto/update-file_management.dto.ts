import { PartialType } from '@nestjs/swagger';
import { CreateFileManagementDto } from './create-file_management.dto';

export class UpdateFileManagementDto extends PartialType(CreateFileManagementDto) {}
