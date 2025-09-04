import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { SubjectMaterialsService } from './subject_materials.service';
import { FileUploadAdapterImpl } from './adapters/file-upload-adapter';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('subject-materials')
@ApiTags(" Subject Materials ")
export class SubjectMaterialsController {
  constructor(
    private readonly subjectMaterialsService: SubjectMaterialsService,
    private readonly fileAdapter: FileUploadAdapterImpl,
  ) {}



  @Post('upload')
  @ApiOperation({ summary: 'Upload multiple subject materials (documents & books)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload documents and books along with optional links and notes',
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        books: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        links: {
          type: 'object',
          additionalProperties: { type: 'string' },
          example: { google: 'https://google.com' },
        },
        notes: {
          type: 'object',
          additionalProperties: { type: 'string' },
          example: { note1: 'Important note here' },
        },
      },
    },
  })
  async uploadMaterial(
    @Param('subjectId') subjectId: string,
    @Req() req: any,
  ) {


  }
}
