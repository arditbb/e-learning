import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class InviteProf {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
