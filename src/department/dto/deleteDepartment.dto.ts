import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDepartment {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
