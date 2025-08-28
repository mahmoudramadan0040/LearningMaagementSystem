import { Injectable } from '@nestjs/common';
import { CreateFileManagementDto } from './dto/create-file_management.dto';
import { UpdateFileManagementDto } from './dto/update-file_management.dto';
import { FileManagement } from './entities/file_management.entity';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class FileManagementService {
    constructor(
    @InjectModel(FileManagement)
    private readonly fileRepo: typeof FileManagement,
  ) {}


  async saveFile(file: Express.Multer.File): Promise<FileManagement> {
   return this.fileRepo.create(file as any );
  }

  async findAll(): Promise<FileManagement[]> {
    return this.fileRepo.findAll();
  }
}
