import { UploadedFile } from "../interface/UploadFile.interface";
export interface FileUploadAdapter {
  getFiles(req: any): Promise<UploadedFile[]| null>;
}