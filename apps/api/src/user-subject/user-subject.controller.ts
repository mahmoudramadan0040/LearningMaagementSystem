import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserSubjectService } from './user-subject.service';
import { CreateUserSubjectDto } from './dto/create-user-subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user-subject.dto';
import { EnrollSubjectDto } from './dto/enroll-subject.dto';
import { UnenrollSubjectDto } from './dto/unenroll-subject.dto';

@Controller('user-subject')
export class UserSubjectController {
  constructor(private readonly userSubjectService: UserSubjectService) {}

  // ========== ENROLLMENT ENDPOINTS ==========

  // Enroll a user in a subject
  @Post('users/:userId/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enrollUserInSubject(
    @Param('userId') userId: string,
    @Body() enrollSubjectDto: EnrollSubjectDto,
  ) {
    return this.userSubjectService.enrollUserInSubject(
      userId,
      enrollSubjectDto,
    );
  }

  // Get all subjects a user is enrolled in
  @Get('users/:userId/subjects')
  async getUserEnrolledSubjects(@Param('userId') userId: string) {
    return this.userSubjectService.getUserEnrolledSubjects(userId);
  }

  // Unenroll a user from a subject
  @Delete('users/:userId/unenroll')
  @HttpCode(HttpStatus.OK)
  async unenrollUserFromSubject(
    @Param('userId') userId: string,
    @Body() unenrollSubjectDto: UnenrollSubjectDto,
  ) {
    return this.userSubjectService.unenrollUserFromSubject(
      userId,
      unenrollSubjectDto,
    );
  }

  // Get all users enrolled in a specific subject
  @Get('subjects/:subjectId/users')
  async getSubjectEnrolledUsers(@Param('subjectId') subjectId: string) {
    return this.userSubjectService.getSubjectEnrolledUsers(subjectId);
  }

  // Check if user is enrolled in a specific subject
  @Get('users/:userId/subjects/:subjectId/check')
  async isUserEnrolledInSubject(
    @Param('userId') userId: string,
    @Param('subjectId') subjectId: string,
  ) {
    return this.userSubjectService.isUserEnrolledInSubject(userId, subjectId);
  }

  // Get enrollment statistics
  @Get('stats')
  async getEnrollmentStats() {
    return this.userSubjectService.getEnrollmentStats();
  }

  // ========== LEGACY ENDPOINTS (for backward compatibility) ==========

  @Post()
  create(@Body() createUserSubjectDto: CreateUserSubjectDto) {
    return this.userSubjectService.create(createUserSubjectDto);
  }

  @Get()
  findAll() {
    return this.userSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSubjectService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSubjectDto: UpdateUserSubjectDto,
  ) {
    return this.userSubjectService.update(id, updateUserSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSubjectService.remove(id);
  }
}
