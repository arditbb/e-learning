import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthProfessorService } from './authProfessor.service';
import { InviteProf, LoginProfessor, ValidateProfessor } from './dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuth, ProfessorAuth } from 'src/decorators';

@ApiTags('Professors')
@Controller('v1/auth/professor')
export class AuthProfessorController {
  constructor(private readonly authProfessorService: AuthProfessorService) {}

  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite Professor via email' })
  @Post('invite-professor')
  async inviteDoctor(@Body() body: InviteProf, req: Request) {
    return await this.authProfessorService.register(body, req);
  }
  @ProfessorAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite Professor via email' })
  @Post('settle-professor')
  async settleProfessor(@Body() body: ValidateProfessor, req: Request) {
    return await this.authProfessorService.settleProfessor(body, req);
  }

  @Post('login')
  async loginProfessor(@Body() body: LoginProfessor, req: Request) {
    return await this.authProfessorService.loginProfessor(body, req);
  }

  @ProfessorAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get All Professor's Students" })
  @Get('get-all-my-students')
  async getAllMyStudents(@Req() req) {
    return await this.authProfessorService.getAllProfStudents(req.user.id);
  }
}
