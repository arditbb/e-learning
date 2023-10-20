import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExam } from './dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async createExam(body: CreateExam) {
    const exists = await this.prisma.exam.findFirst({
      where: {
        course_id: body.course_id,
      },
    });
    if (exists) {
      throw new BadRequestException('Exam Already Exists');
    }
    const checkProfessorForExam = await this.prisma.professor.findFirst({
      where: {
        id: body.professor_id,
        courses: {
          some: {
            id: body.course_id,
          },
        },
      },
    });

    if (!checkProfessorForExam) {
      throw new UnauthorizedException(
        'You are not a professor for the selected course',
      );
    }

    const exam = await this.prisma.exam.create({
      data: {
        course_id: body.course_id,
        professor_id: body.professor_id,
      },
    });

    return {
      success: true,
      message: 'Successfully assigned this exam to this professor!',
      data: exam,
    };
  }
}
