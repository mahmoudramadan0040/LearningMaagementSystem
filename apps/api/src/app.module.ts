import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './department/department.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { DatabaseModule } from './database/database.module';
import { UserSubjectModule } from './user-subject/user-subject.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env globally
    UsersModule, 
    DepartmentModule, 
    SubjectModule, 
    GradeModule, 
    DatabaseModule, UserSubjectModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
