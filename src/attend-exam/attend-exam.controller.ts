import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuth, ProfessorAuth, StudentAuth } from 'src/decorators';
import { AttendExamService } from './attend-exam.service';
import { AttendExamDTO, DeleteAttended, GradeStudentDto } from './dto';

@ApiTags('Attend Exam Student')
@Controller('v1/attend')
export class AttendExamController {
  constructor(private readonly attend: AttendExamService) {}

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Attend an exam' })
  @Post('exam')
  async createExam(@Req() req, @Body() body: AttendExamDTO) {
    return await this.attend.attendExam(req.user.id, body);
  }

  @ProfessorAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Professor grades a student' })
  @Post('grade')
  async grade(@Req() req, @Body() body: GradeStudentDto) {
    return await this.attend.gradeStudent(req.user.id, body);
  }

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete attended exam' })
  @Delete('grade')
  async deleteAttended(@Body() body: DeleteAttended) {
    return await this.attend.deleteAttendedExam(body);
  }
}
