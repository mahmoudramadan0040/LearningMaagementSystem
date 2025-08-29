import { Injectable } from '@nestjs/common';
import { FileUploadAdapter } from './file-upload-adapter.interface';
import { UploadedFile } from '../interface/UploadFile.interface';
@Injectable()
export class FileUploadAdapterImpl implements FileUploadAdapter {
  async getFile(req: any): Promise<UploadedFile | null> {
    

    if (req.file && typeof req.file === 'function') {
      // Fastify (fastify-multipart)
      // Fastify multipart
      const parts = req.parts();
      for await (const part of parts) {
        if (part.file) {
          const buffer = await part.toBuffer();
          return {
            buffer,
            originalName: part.filename,
            mimetype: part.mimetype,
            size: buffer.length,
          };
        }
      }
    }
    if (req.file) {
      // Express (Multer)
      return {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    
    return null;
  }
}
