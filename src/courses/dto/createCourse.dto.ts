import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
enum SemesterCourse {
  spring,
  summer,
  autumn,
  winter,
}

export class CreateCourse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(SemesterCourse)
  @IsNotEmpty()
  @ApiProperty()
  semester;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  ects: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  professorId: string;
}
