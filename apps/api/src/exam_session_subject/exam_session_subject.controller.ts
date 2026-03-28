// exam-session-subject.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ExamSessionSubjectService } from './exam_session_subject.service';

@Controller('exam-sessions/:sessionId/subjects')
export class ExamSessionSubjectController {
  constructor(
    private readonly sessionSubjectService: ExamSessionSubjectService,
  ) {}

  // --------------------------------------------------
  // 1) Get all subjects linked to a session
  // --------------------------------------------------
  @Get()
  getSubjects(@Param('sessionId') sessionId: string) {
    return this.sessionSubjectService.getSubjects(sessionId);
  }

  // --------------------------------------------------
  // 2) Add a single subject
  // --------------------------------------------------
  @Post()
  addSubject(
    @Param('sessionId') sessionId: string,
    @Body('subjectId') subjectId: string,
  ) {
    return this.sessionSubjectService.addSubject(sessionId, subjectId);
  }

  // --------------------------------------------------
  // 3) Add multiple subjects
  // --------------------------------------------------
  @Post('bulk')
  addSubjects(
    @Param('sessionId') sessionId: string,
    @Body('subjectIds') subjectIds: string[],
  ) {
    return this.sessionSubjectService.addSubjects(sessionId, subjectIds);
  }

  // --------------------------------------------------
  // 4) Remove single subject
  // --------------------------------------------------
  @Delete(':subjectId')
  removeSubject(
    @Param('sessionId') sessionId: string,
    @Param('subjectId') subjectId: string,
  ) {
    return this.sessionSubjectService.removeSubject(sessionId, subjectId);
  }

  // --------------------------------------------------
  // 5) Replace all subjects (SET)
  // --------------------------------------------------
  @Put()
  setSubjects(
    @Param('sessionId') sessionId: string,
    @Body('subjectIds') subjectIds: string[],
  ) {
    return this.sessionSubjectService.setSubjects(sessionId, subjectIds);
  }
}
