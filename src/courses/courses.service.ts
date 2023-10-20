import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourse, RegisterStudentCourses } from './dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(body: CreateCourse) {
    const checkIfExists = await this.prisma.course.findFirst({
      where: {
        name: body.name,
      },
    });

    if (checkIfExists) {
      throw new BadRequestException(
        'Course already Exists! If you want to do changes, please update it !',
      );
    }

    const course = await this.prisma.course.create({
      data: {
        name: body.name,
        ects: body.ects,
        semester: body.semester,
        professor_id: body.professorId,
      },
    });

    if (!course) {
      throw new Error('Could not create Course');
    }

    return {
      success: true,
      data: course,
    };
  }

  async registerStudentCourse(body: RegisterStudentCourses, userId: string) {
    const exists = await this.prisma.student.findFirst({
      where: {
        courses: {
          some: {
            id: body.course_id,
          },
        },
      },
      include: {
        courses: true,
      },
    });

    if (exists) {
      throw new Error('You have already registered this course!');
    }

    const registerStudentCourse = await this.prisma.student.update({
      where: {
        id: userId,
      },
      data: {
        courses: {
          connect: {
            id: body.course_id,
          },
        },
      },
    });

    if (!registerStudentCourse) {
      throw new BadRequestException('Could not register this course!');
    }

    return {
      success: true,
      data: registerStudentCourse,
    };
  }

  async deleteStudentCourse(body: RegisterStudentCourses, userId: string) {
    const checkIfRegistered = await this.prisma.student.findFirst({
      where: {
        courses: {
          some: {
            id: body.course_id,
          },
        },
      },
    });

    if (!checkIfRegistered) {
      throw new BadRequestException(
        'You have not registered this course, so you can not delete it!',
      );
    }

    const deleteStudentCourse = await this.prisma.student.update({
      where: {
        id: userId,
      },
      data: {
        courses: {
          disconnect: {
            id: body.course_id,
          },
        },
      },
    });

    return {
      success: true,
      data: deleteStudentCourse,
    };
  }
}
