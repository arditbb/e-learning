import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStudent, RegisterStudent, UpdateProfile } from './dto';
// import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentAuth } from 'src/decorators';
import { GoogleOAuthGuard } from '../google-oauth.guard';
import { Tracer } from '@opentelemetry/api';

@ApiTags('Students')
@Controller('v1/auth/student')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private tracer: Tracer;

  @Post('register')
  async registerStudent(@Body() body: RegisterStudent) {
    return await this.authService.register(body);
  }

  @Post('login')
  async loginStudent(@Body() body: LoginStudent) {
    return await this.authService.login(body);
  }

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Transcript' })
  @Get('transcript')
  async getTranscript(@Req() req) {
    return await this.authService.getTranscript(req.user.id);
  }

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Failed Exams' })
  @Get('failed-exams')
  async failedExams(@Req() req) {
    return await this.authService.failedExams(req.user.id);
  }

  @StudentAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Profile' })
  @Put('update-profile')
  async updateStudentProfile(@Req() req, @Body() body: UpdateProfile) {
    return await this.authService.updateStudentProfile(req.user.id, body);
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {
    console.log('req', req);
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    console.log('req', req);
    return this.authService.googleLogin(req);
  }

  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get Metrics' })
  // @Get('getMetrics')
  // async getMetrics() {
  //   requestCounter.inc({ method: 'GET', route: 'metrics' });

  //   return await this.authService.metrics();
  // }

  @ApiOperation({ summary: 'Get Metrics' })
  @Get('metrics')
  async getMetrics() {
    return await this.authService.metrics();
  }
}
// const requestCounter = new Counter({
//   name: 'your_app_http_requests_total',
//   help: 'Total number of HTTP requests',
//   labelNames: ['method', 'route'],
// });
