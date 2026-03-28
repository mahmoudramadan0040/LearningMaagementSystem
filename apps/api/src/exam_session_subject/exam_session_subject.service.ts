// exam-session-subject.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Injectable()
export class ExamSessionSubjectService {
  constructor(
    @InjectModel(ExamSession) private examSessionModel: typeof ExamSession,
    @InjectModel(Subject) private subjectModel: typeof Subject,
  ) {}

  // ---------------------------------------------
  // 1) Get all subjects for a session
  // ---------------------------------------------
  async getSubjects(sessionId: string) {
    const session = await this.examSessionModel.findByPk(sessionId, {
      include: [Subject],
    });

    if (!session) throw new NotFoundException('Exam session not found');

    return session.subjects;
  }

  // ---------------------------------------------
  // 2) Add one subject to session
  // ---------------------------------------------
  async addSubject(sessionId: string, subjectId: string) {
    const session = await this.examSessionModel.findByPk(sessionId);
    if (!session) throw new NotFoundException('Exam session not found');

    await session.$add('subjects', subjectId);
    return { message: 'Subject added successfully' };
  }

  // ---------------------------------------------
  // 3) Add multiple subjects to session
  // ---------------------------------------------
  async addSubjects(sessionId: string, subjectIds: string[]) {
    const session = await this.examSessionModel.findByPk(sessionId);
    if (!session) throw new NotFoundException('Exam session not found');

    await session.$add('subjects', subjectIds);
    return { message: 'Subjects added successfully' };
  }

  // ---------------------------------------------
  // 4) Remove one subject from session
  // ---------------------------------------------
  async removeSubject(sessionId: string, subjectId: string) {
    const session = await this.examSessionModel.findByPk(sessionId);
    if (!session) throw new NotFoundException('Exam session not found');

    await session.$remove('subjects', subjectId);
    return { message: 'Subject removed successfully' };
  }

  // ---------------------------------------------
  // 5) Replace all subjects (SET)
  // ---------------------------------------------
  async setSubjects(sessionId: string, subjectIds: string[]) {
    const session = await this.examSessionModel.findByPk(sessionId);
    if (!session) throw new NotFoundException('Exam session not found');

    await session.$set('subjects', subjectIds);
    return { message: 'Subjects updated successfully' };
  }
}
