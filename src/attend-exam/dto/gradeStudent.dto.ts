import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
enum Grades {
  A,
  B,
  C,
  D,
  E,
  F,
}
export class GradeStudentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty()
  @IsEnum(Grades)
  @IsNotEmpty()
  grade;
}
