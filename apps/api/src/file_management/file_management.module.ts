import { Module } from '@nestjs/common';
import { FileManagementService } from './file_management.service';
import { FileManagementController } from './file_management.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileManagement } from './entities/file_management.entity';
import { User } from 'src/users/entities/user.entity';
import { FileUploadAdapterImpl } from './adapters/file-upload-adapter';

@Module({
  imports:[SequelizeModule.forFeature([FileManagement,User])],
  controllers: [FileManagementController],
  providers: [FileManagementService,
    FileUploadAdapterImpl
  ],
  exports:[FileManagementService]
})
export class FileManagementModule {}
