export interface UploadedFile {
  originalName: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}