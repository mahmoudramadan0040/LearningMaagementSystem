import { Test, TestingModule } from '@nestjs/testing';
import { SubjectMaterialsController } from './subject_materials.controller';
import { SubjectMaterialsService } from './subject_materials.service';

describe('SubjectMaterialsController', () => {
  let controller: SubjectMaterialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectMaterialsController],
      providers: [SubjectMaterialsService],
    }).compile();

    controller = module.get<SubjectMaterialsController>(SubjectMaterialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
