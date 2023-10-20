import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { AdminAuth } from 'src/decorators';
import { CreateExam } from './dto';

@ApiTags('Exam')
@Controller('v1/exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an exam' })
  @Post('create-exam')
  async createExam(@Body() body: CreateExam) {
    return await this.examService.createExam(body);
  }
}
