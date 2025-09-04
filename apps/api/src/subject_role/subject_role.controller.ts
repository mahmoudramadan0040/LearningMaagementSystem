import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SubjectRoleService } from './subject_role.service';
import { CreateSubjectRoleDto } from './dto/create-subject_role.dto';
import { UpdateSubjectRoleDto } from './dto/update-subject_role.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('subject-role')
export class SubjectRoleController {
  constructor(private readonly subjectRoleService: SubjectRoleService) {}

  @ApiOperation({ summary: 'Create a subject role' })
  @ApiResponse({
    status: 201,
    description: 'The subject role has been created.',
  })
  @ApiBody({ type: CreateSubjectRoleDto })
  @Post()
  create(@Body() createSubjectRoleDto: CreateSubjectRoleDto) {
    return this.subjectRoleService.create(createSubjectRoleDto);
  }

  @ApiOperation({ summary: 'Get all subject roles' })
  @ApiResponse({ status: 200, description: 'Return all subject roles.' })
  @Get('/subject/:id')
  findAll(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subjectRoleService.findAllRole(id);
  }

  @ApiOperation({ summary: 'Get a subject role by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Return the subject role.' })
  @ApiResponse({ status: 404, description: 'Subject role not found.' })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subjectRoleService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a subject role by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateSubjectRoleDto })
  @ApiResponse({
    status: 200,
    description: 'The subject role has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Subject role not found.' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSubjectRoleDto: UpdateSubjectRoleDto,
  ) {
    return this.subjectRoleService.update(id, updateSubjectRoleDto);
  }

  @ApiOperation({ summary: 'Delete a subject role by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The subject role has been removed.',
  })
  @ApiResponse({ status: 404, description: 'Subject role not found.' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe())id: string) {
    return this.subjectRoleService.remove(id);
  }
}
