import { Module } from '@nestjs/common';
import { AuthProfessorService } from './authProfessor.service';
import { AuthProfessorController } from './authProfessor.controller';

@Module({
  imports: [],
  providers: [AuthProfessorService],
  controllers: [AuthProfessorController],
})
export class AuthProfessorModule {}
