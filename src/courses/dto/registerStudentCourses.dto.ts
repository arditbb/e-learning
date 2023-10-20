import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterStudentCourses {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_id: string;
}
