import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendExamDTO, DeleteAttended, GradeStudentDto } from './dto';

@Injectable()
export class AttendExamService {
  constructor(private readonly prisma: PrismaService) {}

  async attendExam(userId: string, body: AttendExamDTO) {
    const attended = await this.prisma.attendedExam.findFirst({
      where: {
        student_id: userId,
        professor_id: body.professor_id,
        course_id: body.course_id,
      },
    });

    if (attended) {
      throw new UnauthorizedException('You have already attended This exam');
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
      throw new BadRequestException(
        'This is not the right professor for this course!',
      );
    }

    const attend = await this.prisma.attendedExam.create({
      data: {
        student_id: userId,
        professor_id: body.professor_id,
        course_id: body.course_id,
      },
    });

    return {
      success: true,
      data: attend,
    };
  }

  async gradeStudent(userId: string, body: GradeStudentDto) {
    const graded = await this.prisma.attendedExam.findFirst({
      where: {
        professor_id: userId,
        student_id: body.student_id,
        course_id: body.course_id,
        grade: {
          not: null || 'F',
        },
      },
    });

    if (graded) {
      throw new UnauthorizedException("you can't grade a student twice");
    }

    const attended = await this.prisma.attendedExam.findFirst({
      where: {
        student_id: body.student_id,
        course_id: body.course_id,
      },
    });

    if (!attended) {
      throw new NotFoundException(
        'This Student has not attended this exam yet',
      );
    }

    const grade = await this.prisma.attendedExam.update({
      where: {
        id: attended.id,
      },
      data: {
        grade: body.grade,
      },
    });
    const ects = 6;

    if (grade) {
      await this.prisma.student.update({
        where: {
          id: body.student_id,
        },
        data: {
          ects: { increment: ects },
        },
      });
    }

    return {
      success: true,
      data: grade,
    };
  }

  async deleteAttendedExam(body: DeleteAttended) {
    await this.prisma.attendedExam.delete({
      where: {
        id: body.attendedExamId,
      },
    });
  }
}
