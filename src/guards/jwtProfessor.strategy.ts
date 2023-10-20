import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategyProfessor extends PassportStrategy(
  Strategy,
  'professor-jwt',
) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JSON_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    const session = await this.prismaService.session.findUnique({
      where: {
        id: payload.sessionId,
        OR: [{ professor_id: payload.user.id }, { admin_id: payload.user.id }],
      },
    });

    if (!session) {
      throw new UnauthorizedException('Unauthorized User!');
    }
    // Find user in database where id : payload.userId
    const user = await this.prismaService.professor.findUnique({
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
