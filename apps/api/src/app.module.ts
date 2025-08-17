import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './department/department.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { DatabaseModule } from './database/database.module';
import { UserSubjectModule } from './user-subject/user-subject.module';

@Module({
  imports: [
    UsersModule, 
    DepartmentModule, 
    SubjectModule, 
    GradeModule, 
    DatabaseModule, UserSubjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
