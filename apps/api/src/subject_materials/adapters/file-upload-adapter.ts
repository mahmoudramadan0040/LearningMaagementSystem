import { Injectable } from '@nestjs/common';
import { FileUploadAdapter } from './file-upload-adapter.interface';
import { UploadedFile } from '../interface/UploadFile.interface';
@Injectable()
export class FileUploadAdapterImpl implements FileUploadAdapter {
  async getFiles(req: any): Promise<UploadedFile[] | null> {
    const files: UploadedFile[] = [];

    if (req.file && typeof req.file === 'function') {
      // Fastify (fastify-multipart)
      // Fastify multipart
      const parts = req.parts();
      for await (const part of parts) {
        if (part.file) {
          const buffer = await part.toBuffer();
          files.push({
            buffer,
            originalName: part.filename,
            mimetype: part.mimetype,
            size: buffer.length,
          });
          return files.length ? files : null;
        }
      }
    }

    if (req.files) {
      if (Array.isArray(req.files)) {
        // Case: FilesInterceptor (array upload)
        for (const file of req.files) {
          files.push({
            buffer: file.buffer,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });
        }
      } else if (typeof req.files === 'object') {
        // Case: FileFieldsInterceptor (multiple fields)
        for (const fieldName of Object.keys(req.files)) {
          for (const file of req.files[fieldName]) {
            files.push({
              buffer: file.buffer,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            });
          }
        }
      }
      return files.length ? files : null;
    }
    // ✅ Single file (fallback for req.file)
    if (req.file) {
      files.push({
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
      return files;
    }

    return null;
  }
}
