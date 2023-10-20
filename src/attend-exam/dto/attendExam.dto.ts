import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttendExamDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  professor_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_id: string;
}
