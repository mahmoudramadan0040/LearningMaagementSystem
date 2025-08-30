import { Injectable } from '@nestjs/common';
import path from 'path';
import { SubjectMaterial } from './entities/subject_material.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from './interface/UploadFile.interface';
import { CreateSubjectMaterialDto } from './dto/create-subject_material.dto';
@Injectable()
export class SubjectMaterialsService {
  private baseUploadDir = path.join(
    process.cwd(),
    'uploads',
    'subject-material',
  );

  constructor(
    @InjectModel(SubjectMaterial)
    private readonly materialRepo: typeof SubjectMaterial,
  ) {}

  private ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  private generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}-${Date.now()}${ext}`;
  }

  async uploadMaterials(
    subjectId: number,
    files: { [category: string]: UploadedFile[] },dto: CreateSubjectMaterialDto, // { documents: [...], books: [...] }
  ): Promise<SubjectMaterial> {
    const folderPath = path.join(this.baseUploadDir, subjectId.toString());
    this.ensureDirExists(folderPath);

    let material = await this.materialRepo.findOne({ where: { subjectId } });
    if (!material) {
      material = await this.materialRepo.create({
        subjectId,
        links: dto.links|| {},
        documents: {},
        books: {},
        Notes: dto.notes || {},
      } as any);
    }

    for (const category of Object.keys(files)) {
      if (!['documents', 'books'].includes(category)) continue;

      for (const file of files[category]) {
        const filename = this.generateUniqueFilename(file.originalName);
        const filePath = path.join(folderPath, filename);
        fs.writeFileSync(filePath, file.buffer);

        const uuidKey = uuidv4();
        material[category][uuidKey] = {
          path: `/uploads/subject-material/${subjectId}/${filename}`,
          originalName: file.originalName,
          size: file.size,
          mimetype: file.mimetype,
        };
      }
    }

    await material.save();
    return material;
  }
}
