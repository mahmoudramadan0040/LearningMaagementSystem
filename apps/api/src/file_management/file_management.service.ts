import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FileManagement } from './entities/file_management.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import {  v1 as uuidv1 } from 'uuid';
import { User } from 'src/users/entities/user.entity';
import { CreationAttributes } from 'sequelize';
import { UploadedFile } from './interface/UploadFile.interface';
@Injectable()
export class FileManagementService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectModel(FileManagement)
    private readonly fileRepo: typeof FileManagement,
    @InjectModel(User)
    private readonly userRepo:typeof User
  ) {}


  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv1()}${ext}`;
  }

  private validateFile(file: UploadedFile, allowedTypes: string[], maxSizeMB: number) {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new BadRequestException(`File size exceeds ${maxSizeMB}MB`);
    }
  }

  async uploadFile(file: UploadedFile, userId: string): Promise<FileManagement> {
    this.ensureUploadDir();
    this.validateFile(file, ['image/jpeg', 'image/png', 'application/pdf'], 5);

    const filename = this.generateUniqueFilename(file.originalName);
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    return this.fileRepo.create({
      originalName: file.originalName,
      filename: filename,
      type: file.mimetype,
      url: `/uploads/${filename}`,
      userId,
    }as CreationAttributes<FileManagement>);
  }

  async uploadProfileImage(file: UploadedFile, userId: string): Promise<User> {
    this.ensureUploadDir();
    this.validateFile(file, ['image/jpeg', 'image/png'], 3);

    const user = await this.userRepo.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    const filename = this.generateUniqueFilename(file.originalName);
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    user.profileImage = `/uploads/${filename}`;
    await user.save();

    return user;
  }

  async updateFile(file:UploadedFile,fileId: string): Promise<FileManagement> {
    this.ensureUploadDir();

    const existingFile = await this.fileRepo.findByPk(fileId);
    if (!existingFile) throw new NotFoundException('File not found');

    // Remove old file from disk
    const oldFilePath = path.join(this.uploadDir, existingFile.dataValues.filename);
    if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

    const filename = this.generateUniqueFilename(file.originalName);
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    existingFile.originalName = file.originalName;
    existingFile.filename = filename;
    existingFile.type = file.mimetype;
    existingFile.url = `/uploads/${filename}`;

    await existingFile.save();
    return existingFile;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.fileRepo.findByPk(fileId);
    if (!file) throw new NotFoundException('File not found');
    
    const filePath = path.join(this.uploadDir, file.dataValues.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.destroy();
  }

  async getUserFiles(userId: string): Promise<FileManagement[]> {
    return this.fileRepo.findAll({ where: { userId } });
  }
}
