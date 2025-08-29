import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  UseInterceptors,
  Inject,
  Req,
} from '@nestjs/common';
import { FileManagementService } from './file_management.service';
import type { FileUploadAdapter } from './interface/file-upload.adapter';
import { UploadedFile } from './interface/UploadFile.interface';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UUID } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { FileUploadAdapterImpl } from './adapters/file-upload-adapter';
@Controller('file-management')
export class FileManagementController {
  constructor(
    private readonly fileManagementService: FileManagementService,
    private readonly fileUploadAdapter: FileUploadAdapterImpl,
  ) {}

  //#region
  @Post('upload/:userId')
  @ApiOperation({ summary: 'Upload any file for a user' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiConsumes('multipart/form-data') // ✅ Tell Swagger it's multipart
  // @UseInterceptors(FileInterceptor('file')) // to use multer instead fastify 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // ✅ Needed for file input
        },
      },
    },
  })
  //#endregion
  async uploadFile(@Param('userId') userId: string, @Req() req: any) {
    const file = await this.fileUploadAdapter.getFile(req);
    if (!file)
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    const fileRecord = await this.fileManagementService.uploadFile(
      file,
      userId,
    );
    if (!fileRecord)
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    return { message: 'File uploaded', data: fileRecord };
  }

  @Post('upload-profile/:userId')
  @ApiOperation({ summary: 'Upload or replace user profile image' })
  @ApiResponse({
    status: 201,
    description: 'Profile image uploaded successfully',
  })
  @ApiConsumes('multipart/form-data') // ✅ Tell Swagger it's multipart
   // @UseInterceptors(FileInterceptor('file')) // to use multer instead fastify 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // ✅ Needed for file input
        },
      },
    },
  })
  async uploadProfileImage(@Param('userId') userId: string, @Req() req: any) {
    const file = await this.fileUploadAdapter.getFile(req);
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const fileRecord = await this.fileManagementService.uploadProfileImage(
      file,
      userId,
    );
    if (!fileRecord)
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    return { message: 'Profile image uploaded', data: fileRecord };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('id') id: string) {
    await this.fileManagementService.deleteFile(id);
    return { message: 'File deleted' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a file by ID (replace old file)' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiConsumes('multipart/form-data') // ✅ Tell Swagger it's multipart
   // @UseInterceptors(FileInterceptor('file')) // to use multer instead fastify 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // ✅ Needed for file input
        },
      },
    },
  })
  async updateFile(@Param('id') id: string, @Req() req: any) {
    const file = await this.fileUploadAdapter.getFile(req);
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const fileRecord = await this.fileManagementService.updateFile(
      file,
      id,
    );
    if (!fileRecord)
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    return { message: 'File updated', data: fileRecord };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all files for a user' })
  @ApiParam({ name: 'userId', type: UUID })
  @ApiResponse({ status: 200, description: 'List of files for the user' })
  async getFilesForUser(@Param('userId') userId: string) {
    return this.fileManagementService.getUserFiles(userId);
  }
}
