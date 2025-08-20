import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject)
    private readonly subjectRepository: typeof Subject,
  ) {}
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectRepository.create(createSubjectDto as any);
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectRepository.findAll();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findByPk(id);
    if (!subject)
      throw new NotFoundException(`Subject with ID "${id}" not found`);
    return subject;
  }

  update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: string) {
    return `This action removes a #${id} subject`;
  }
}
