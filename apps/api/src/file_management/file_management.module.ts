import { Module } from '@nestjs/common';
import { FileManagementService } from './file_management.service';
import { FileManagementController } from './file_management.controller';

@Module({
  controllers: [FileManagementController],
  providers: [FileManagementService],
})
export class FileManagementModule {}
