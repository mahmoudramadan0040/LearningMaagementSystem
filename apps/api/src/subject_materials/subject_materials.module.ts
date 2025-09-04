import { Module } from '@nestjs/common';
import { SubjectMaterialsService } from './subject_materials.service';
import { SubjectMaterialsController } from './subject_materials.controller';
import { SubjectMaterial } from './entities/subject_material.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileUploadAdapterImpl } from './adapters/file-upload-adapter';

@Module({
  imports:[SequelizeModule.forFeature([SubjectMaterial])],
  controllers: [SubjectMaterialsController],
  providers: [SubjectMaterialsService,FileUploadAdapterImpl],
})
export class SubjectMaterialsModule {}
