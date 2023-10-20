import { Module } from '@nestjs/common';
import { AttendExamService } from './attend-exam.service';
import { AttendExamController } from './attend-exam.controller';

@Module({
  providers: [AttendExamService],
  controllers: [AttendExamController]
})
export class AttendExamModule {}
