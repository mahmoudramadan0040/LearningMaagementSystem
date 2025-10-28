import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamSessionDto } from './dto/create-exam_session.dto';
import { UpdateExamSessionDto } from './dto/update-exam_session.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ExamSession } from './entities/exam_session.entity';

@Injectable()
export class ExamSessionService {
  constructor(
    @InjectModel(ExamSession)
    private readonly examSessionRepository: typeof ExamSession,
  ) {}

  async create(
    createExamSessionDto: CreateExamSessionDto,
  ): Promise<ExamSession> {
    return await this.examSessionRepository.create(createExamSessionDto as any);
  }

  async findAll(): Promise<ExamSession[]> {
    return await this.examSessionRepository.findAll();
  }

  async findOne(id: string): Promise<ExamSession | null> {
    const session = await this.examSessionRepository.findByPk(id);
    if (!session) throw new NotFoundException('Exam session not found');
    return session;
  }

  async update(
    id: string,
    updateExamSessionDto: UpdateExamSessionDto,
  ): Promise<ExamSession> {
    const session = await this.examSessionRepository.findByPk(id);
    if (!session) throw new NotFoundException('Exam session not found');
    await session.update(updateExamSessionDto as any);
    return session;
  }

  async remove(id: string): Promise<void> {
    const session = await this.examSessionRepository.findByPk(id);
    if (!session) throw new NotFoundException('Exam session not found');
    await session.destroy();
  }
}
