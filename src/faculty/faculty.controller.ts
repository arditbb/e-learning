import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';
import { AdminAuth } from 'src/decorators';
import { CreateFaculty } from './dto';

@ApiTags('Faculty')
@Controller('v1/faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Faculty' })
  @Post()
  async createFaculty(@Body() body: CreateFaculty) {
    return await this.facultyService.createFaculty(body);
  }

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Faculty' })
  @Delete()
  async deleteFaculty(@Body() body: CreateFaculty) {
    return await this.facultyService.createFaculty(body);
  }
}
