import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ExamSessionService } from './exam_session.service';
import { CreateExamSessionDto } from './dto/create-exam_session.dto';
import { UpdateExamSessionDto } from './dto/update-exam_session.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('exam-session')
@Controller('exam-session')
export class ExamSessionController {
  constructor(private readonly examSessionService: ExamSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create exam session' })
  @ApiBody({ type: CreateExamSessionDto })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() createExamSessionDto: CreateExamSessionDto) {
    return this.examSessionService.create(createExamSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all exam sessions' })
  findAll() {
    return this.examSessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one exam session by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.examSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam session by ID' })
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateExamSessionDto: UpdateExamSessionDto,
  ) {
    return this.examSessionService.update(id, updateExamSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam session by ID' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.examSessionService.remove(id);
  }
}
