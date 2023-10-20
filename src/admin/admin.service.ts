import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAdmin, RegisterAdmin, UpdateProfile } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { getClientIp } from '@supercharge/request-ip';
import { lookup } from 'geoip-lite';
import { parse } from 'useragent';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signJwtToken(payload: any, secret) {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '2h',
    });
  }

  async createSession({ user, req }) {
    // @supercharge/request-ip // ip
    // geoip-lite   // location
    // useragent  // device
    const ip = getClientIp(req);
    const location = lookup(ip);
    const agent = req?.headers['user-agent']
      ? parse(req.headers['user-agent']).family.toString()
      : null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sessionData = {
      adminId: user.id,
      ipAddress: ip,
      location: location,
      device: agent,
    };

    const session = await this.prisma.session.create({
      data: {
        ipAddress: ip,
        device: agent ? agent.toString() : null,
        location: location ? location.city : null,
        admin: {
          connect: { id: user.id },
        },
      },
    });

    const token = this.jwtService.sign(
      {
        user: user,
        sessionId: session.id,
      },
      { secret: process.env.JSON_TOKEN_KEY },
    );
    return token;
  }

  async registerAdmin(body: RegisterAdmin, req: Request) {
    const data: any = body;
    data.password = await argon2.hash(data.password);

    const admin = await this.prisma.admin.create({
      data: data,
    });
    delete admin.password;

    const token = await this.createSession({ user: admin, req });

    return {
      success: true,
      data: admin,
      token: token,
    };
  }

  async loginAdmin(body: LoginAdmin, req: Request) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!admin) {
      throw new NotFoundException('Token not valid!');
    }
    if (!admin.password) {
      throw new ForbiddenException('Invalid Password');
    }

    const token = await this.createSession({ user: admin, req });
    delete admin.password;

    return {
      success: true,
      data: admin,
      token: token,
    };
  }

  async updateProfessorProfile(userId: string, body: UpdateProfile) {
    const data: any = body;
    data.password = await argon2.hash(data.password);
    const student = await this.prisma.student.update({
      where: {
        id: userId,
      },
      data: data,
    });

    return {
      success: true,
      data: student,
    };
  }
}
