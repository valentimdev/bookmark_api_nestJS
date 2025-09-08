import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  prisma: any;
  constructor(config: ConfigService) {
    const secret = config.get('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      // Se o usuário com o ID do token não existir mais no banco.
      throw new UnauthorizedException('User not found or token invalid.');
    }

    // O objeto retornado aqui será injetado em req.user nas rotas protegidas
    // Remova o hash antes de retornar
    delete user.hash;
    return user;
  }
}
