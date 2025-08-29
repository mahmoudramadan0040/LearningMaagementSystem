import { UploadedFile } from "../interface/UploadFile.interface";
export interface FileUploadAdapter {
  getFile(req: any): Promise<UploadedFile| null>;
}