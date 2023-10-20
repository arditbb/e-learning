import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategyStudent extends PassportStrategy(
  Strategy,
  'student-jwt',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JSON_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    console.log('payload session id', payload.sessionId);
    console.log('payload user id', payload.user.id);
    const session = await this.prisma.session.findUnique({
      where: {
        id: payload.sessionId,
        OR: [{ studentId: payload.user.id }, { admin_id: payload.user.id }],
      },
    });

    if (!session) {
      throw new UnauthorizedException(`Session not found`);
    }

    const user = await this.prisma.student.findUnique({
      where: {
        id: payload.user.id,
        deleted: { not: true },
      },
    });
    // Check if user exist if not throw unauthorized exception
    if (!user) {
      throw new UnauthorizedException('User not Found!');
    }
    return { ...payload, ...user };
  }
}
