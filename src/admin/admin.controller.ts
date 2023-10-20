import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdmin, RegisterAdmin } from './dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register-admin')
  async registerAdmin(@Body() body: RegisterAdmin, req: Request) {
    return await this.adminService.registerAdmin(body, req);
  }

  @Post('loginAdmin')
  async loginAdmin(@Body() body: LoginAdmin, req: Request) {
    return await this.adminService.loginAdmin(body, req);
  }
}
