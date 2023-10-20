import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartment, DeleteDepartment } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createDepartment(body: CreateDepartment) {
    const exists = await this.prisma.department.findUnique({
      where: {
        name: body.name,
      },
    });

    if (exists) {
      throw new BadRequestException('Department Already Exists!');
    }

    const department = await this.prisma.department.create({
      data: {
        name: body.name,
        faculty_id: body.faculty_id,
      },
    });

    if (!department) {
      throw new BadRequestException('Could Not Create This Department!');
    }

    return {
      success: true,
      data: department,
    };
  }

  async deleteDepartment(body: DeleteDepartment) {
    const exists = await this.prisma.department.findUnique({
      where: {
        name: body.name,
      },
    });

    if (!exists) {
      throw new NotFoundException('Could not find the department!');
    }

    const deleteThisDepartment = await this.prisma.department.delete({
      where: {
        name: body.name,
      },
    });
    return {
      success: true,
      message: 'You have deleted this department:',
      data: deleteThisDepartment,
    };
  }
}
