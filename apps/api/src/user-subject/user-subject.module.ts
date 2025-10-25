import { Module } from '@nestjs/common';
import { UserSubjectService } from './user-subject.service';
import { UserSubjectController } from './user-subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSubject } from './entities/user-subject.entity';
import { User } from '../users/entities/user.entity';
import { Subject } from '../subject/entities/subject.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([UserSubject, User, Subject, Department]),
  ],
  controllers: [UserSubjectController],
  providers: [UserSubjectService],
  exports: [UserSubjectService], // Export service for use in other modules
})
export class UserSubjectModule {}
