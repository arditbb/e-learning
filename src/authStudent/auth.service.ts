import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginStudent, RegisterStudent, UpdateProfile } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { lookup } from 'geoip-lite';
import { parse } from 'useragent';
import { getClientIp } from '@supercharge/request-ip';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, // otelSetup,
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

    const sessionData = {
      studentId: user.id,
      ipAddress: ip,
      location: location,
      device: agent,
    };

    const session = await this.prisma.session.create({
      data: sessionData,
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

  async register(body: RegisterStudent) {
    const data: any = body;

    const alreadyExists = await this.prisma.student.findUnique({
      where: {
        email: data.email,
        phone: data.phone,
      },
    });

    if (alreadyExists) {
      throw new BadRequestException('User already exists');
    }

    body.password = await argon2.hash(body.password);
    const student = await this.prisma.student.create({
      data: data,
    });

    if (!student) {
      throw new BadRequestException('Could not register this student!');
    }
    const token = await this.signJwtToken(student, process.env.JSON_TOKEN_KEY);
    delete student.password;

    return {
      success: true,
      data: student,
      token: token,
    };
  }

  async login(body: LoginStudent) {
    const user = await this.prisma.student.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    const verifyPassword = await argon2.verify(user.password, body.password);

    if (!verifyPassword) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const token = this.jwtService.sign(
      {
        user: user,
      },
      { secret: process.env.JSON_TOKEN_KEY },
    );
    return {
      success: true,
      data: user,
      token: token,
    };
  }

  async getTranscript(userId: string) {
    const getTranscript = await this.prisma.attendedExam.findMany({
      where: {
        student_id: userId,
        grade: {
          not: 'F',
        },
      },
    });

    return {
      success: true,
      data: getTranscript,
    };
  }
  async failedExams(userId: string) {
    const failedExams = await this.prisma.attendedExam.findMany({
      where: {
        student_id: userId,
        grade: 'F',
      },
    });

    return {
      success: true,
      data: failedExams,
    };
  }

  async updateStudentProfile(userId: string, body: UpdateProfile) {
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

  async validateOAuthLogin(profile: any) {
    const existingUser = await this.prisma.student.findUnique({
      where: {
        email: profile.emails[0].value,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await this.prisma.student.create({
      data: {
        email: profile.emails[0].value,
      },
    });

    return newUser;
  }
  async googleLogin(req) {
    console.log('req', req);
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async metrics() {
    const students = await this.prisma.student.findMany();
    console.log('students', students);
    return students;
  }

  // async metrics2() {
  //   const metrics = await this.prisma
  //     .$queryRaw`SELECT * FROM information_schema.tables WHERE table_schema = 'public';`;
  //   console.log(metrics);
  //   return metrics;
  // }
}
