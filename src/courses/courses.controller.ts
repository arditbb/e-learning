import { Body, Controller, Post, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourse, RegisterStudentCourses } from './dto';
import { AdminAuth, StudentAuth } from 'src/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course' })
  @Post()
  async createCourse(@Body() body: CreateCourse) {
    return await this.coursesService.createCourse(body);
  }

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register 1 student 1 course' })
  @Post('/register-student-courses')
  async registerStudentCourse(
    @Body() body: RegisterStudentCourses,
    @Req() request,
  ) {
    console.log('request.user', request.user);
    return await this.coursesService.registerStudentCourse(
      body,
      request.user.user.id,
    );
  }

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete 1 student 1 course' })
  @Post('/delete-student-courses')
  async deleteStudentCourse(
    @Body() body: RegisterStudentCourses,
    @Req() request,
  ) {
    console.log('request.user', request.user);
    return await this.coursesService.deleteStudentCourse(
      body,
      request.user.user.id,
    );
  }
}
