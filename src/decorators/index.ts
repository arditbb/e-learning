import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from 'src/guards/jwtAdminAuth.guard';
import { ProfessorJwtAuthGuard } from 'src/guards/jwtProfessorAuth.guard';
import { StudentJwtAuthGuard } from 'src/guards/jwtStudentAuth.guard';

export function ProfessorAuth() {
  return applyDecorators(UseGuards(ProfessorJwtAuthGuard));
}

export function StudentAuth() {
  return applyDecorators(UseGuards(StudentJwtAuthGuard));
}

export function AdminAuth() {
  return applyDecorators(UseGuards(AdminJwtAuthGuard));
}
