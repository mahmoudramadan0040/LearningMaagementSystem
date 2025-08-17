import { Module } from '@nestjs/common';
import { UserSubjectService } from './user-subject.service';
import { UserSubjectController } from './user-subject.controller';

@Module({
  controllers: [UserSubjectController],
  providers: [UserSubjectService],
})
export class UserSubjectModule {}
