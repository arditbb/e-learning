import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { lookup } from 'geoip-lite';
import { parse } from 'useragent';
import { Request } from 'express';
import { getClientIp } from '@supercharge/request-ip';
import {
  InviteProf,
  LoginProfessor,
  UpdateProfile,
  ValidateProfessor,
} from './dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthProfessorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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
      professorId: user.id,
      ipAddress: ip,
      location: location,
      device: agent,
    };

    const session = await this.prisma.session.create({
      data: {
        ipAddress: ip,
        device: agent ? agent.toString() : null,
        location: location ? location.city : null,
        professor: {
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

  async register(body: InviteProf, req: Request) {
    const data: any = body;

    const alreadyExists = await this.prisma.professor.findUnique({
      where: {
        email: data.email,
      },
    });

    if (alreadyExists) {
      throw new BadRequestException('Professor already exists');
    }

    const professor = await this.prisma.professor.create({
      data: data,
    });

    if (!professor) {
      throw new BadRequestException('Could not register this Professor!');
    }
    const token = await this.createSession({ user: professor, req });

    await this.mailerService.sendMail({
      from: 'ardit@tetbituniversity.com',
      to: body.email,
      subject: 'Welcome To Our TETBIT UNIVERSITY 🏫 ',
      template: './inviteProfessor',
      context: {
        link: `${process.env.API}/v1/auth/welcome/${token}`,
      },
    });
    return {
      success: true,
      data: professor,
      token: token,
    };
  }

  async settleProfessor(body: ValidateProfessor, req: Request) {
    body.password = await argon2.hash(body.password);

    const validateToken = await this.jwtService.verify(body.token, {
      secret: process.env.JSON_TOKEN_KEY,
    });
    console.log(validateToken.user.id);

    const checkProfessorPhone = await this.prisma.professor.findUnique({
      where: {
        phone: body.phone,
      },
    });

    if (checkProfessorPhone) {
      throw new BadRequestException('This phone number already exists!');
    }

    const professor = await this.prisma.professor.update({
      where: {
        id: validateToken.user.id,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        password: body.password,
      },
    });

    const token = await this.createSession({ user: professor, req });

    delete professor.password;
    return {
      success: true,
      data: professor,
      token: token,
    };
  }

  async loginProfessor(body: LoginProfessor, req: Request) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!professor) {
      throw new NotFoundException('This email does not exist!');
    }

    const hashedPassword = await argon2.verify(
      professor.password,
      body.password,
    );

    if (!professor || !hashedPassword) {
      throw new ForbiddenException('Invalid Data!');
    }
    const token = await this.createSession({ user: professor, req });
    return {
      success: true,
      data: professor,
      token: token,
    };
  }

  async getAllProfStudents(userId: string) {
    const getAllStudents = await this.prisma.student.findMany({
      where: {
        courses: {
          some: {
            professor_id: userId,
          },
        },
      },
    });
    const data: any = getAllStudents;
    delete data.password;
    return {
      success: true,
      data: data,
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
