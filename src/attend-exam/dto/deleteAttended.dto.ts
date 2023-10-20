import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class DeleteAttended {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attendedExamId: string;
}
