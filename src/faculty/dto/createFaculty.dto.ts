import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFaculty {
  @ApiProperty()
  @IsString()
  name: string;
}
