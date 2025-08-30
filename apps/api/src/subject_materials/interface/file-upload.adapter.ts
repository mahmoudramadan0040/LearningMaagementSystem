import { UploadedFile } from "./UploadFile.interface";

export interface FileUploadAdapter {
  getFile(req: any): Promise<UploadedFile>;
}