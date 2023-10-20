import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { AdminAuth } from 'src/decorators';
import { CreateDepartment, DeleteDepartment } from './dto';

@ApiTags('Faculty Departments')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Department For Faculty' })
  @Post()
  async createDepartment(@Body() body: CreateDepartment) {
    return await this.departmentService.createDepartment(body);
  }

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Department For Faculty' })
  @Delete()
  async deleteDepartment(@Body() body: DeleteDepartment) {
    return await this.departmentService.deleteDepartment(body);
  }
}
