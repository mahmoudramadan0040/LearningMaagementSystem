import { Module } from '@nestjs/common';
import { UserSubjectService } from './user-subject.service';
import { UserSubjectController } from './user-subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSubject } from './entities/user-subject.entity';

@Module({
  imports:[SequelizeModule.forFeature([UserSubject])],
  controllers: [UserSubjectController],
  providers: [UserSubjectService],
})
export class UserSubjectModule {}
