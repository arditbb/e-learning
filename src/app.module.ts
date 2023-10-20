import { Module } from '@nestjs/common';
import { AuthModule } from './authStudent/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { AuthProfessorModule } from './authProfessor/authprofessor.module';
import { EmailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { JwtStrategyProfessor } from './guards/jwtProfessor.strategy';
import { ProfessorJwtAuthGuard } from './guards/jwtProfessorAuth.guard';
import { JwtStrategyAdmin } from './guards/jwtAdmin.strategy';
import { AdminJwtAuthGuard } from './guards/jwtAdminAuth.guard';
import { JwtStrategyStudent } from './guards/jwtStudent.strategy';
import { StudentJwtAuthGuard } from './guards/jwtStudentAuth.guard';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { JwtModule } from '@nestjs/jwt';
import { ExamModule } from './exam/exam.module';
import { AttendExamModule } from './attend-exam/attend-exam.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JSON_TOKEN_KEY,
    }),
    AuthModule,
    PrismaModule,
    CoursesModule,
    AuthProfessorModule,
    EmailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    AdminModule,
    FacultyModule,
    DepartmentModule,
    ExamModule,
    AttendExamModule,
    MetricsModule,
  ],
  controllers: [],
  providers: [
    JwtStrategyProfessor,
    ProfessorJwtAuthGuard,
    JwtStrategyAdmin,
    AdminJwtAuthGuard,
    JwtStrategyStudent,
    StudentJwtAuthGuard,
    GoogleStrategy,
  ],
})
export class AppModule {}
