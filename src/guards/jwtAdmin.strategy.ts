import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategyAdmin extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JSON_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    const session = await this.prismaService.session.findUnique({
      where: {
        id: payload.sessionId,
        admin_id: payload.user.id,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Unauthorized User!');
    }
    const user = await this.prismaService.admin.findUnique({
      where: {
        id: payload.user.id,
        deleted: { not: true },
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not Found!');
    }
    return { ...payload, ...user };
  }
}
