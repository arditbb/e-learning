import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaculty } from './dto';

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  async createFaculty(body: CreateFaculty) {
    const facultyExists = await this.prisma.faculty.findUnique({
      where: {
        name: body.name,
      },
    });

    if (facultyExists) {
      throw new BadRequestException('Faculty already exists!');
    }

    const faculty = await this.prisma.faculty.create({
      data: {
        name: body.name,
      },
    });

    return {
      success: true,
      data: faculty,
    };
  }

  async deleteFaculty(body: CreateFaculty) {
    const checkIfExists = await this.prisma.faculty.findUnique({
      where: {
        name: body.name,
      },
    });

    if (!checkIfExists) {
      throw new NotFoundException('This faculty does not exist');
    }

    const deleteThisFaculty = await this.prisma.faculty.delete({
      where: {
        name: body.name,
      },
    });

    return {
      success: true,
      message: 'You deleted this faculty!',
      data: deleteThisFaculty,
    };
  }
}
