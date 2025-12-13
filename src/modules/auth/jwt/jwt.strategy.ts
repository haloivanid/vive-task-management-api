import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../../database/entities/user.typeorm-entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../../user/user.mapper';
import { FastifyRequest } from 'fastify';
import { JwtBlacklist } from './jwt.blacklist';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserTypeormEntity) private readonly userRepository: Repository<UserTypeormEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: FastifyRequest, payload: any): Promise<User> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException();
    if (JwtBlacklist.isBlacklisted(token)) {
      throw new UnauthorizedException();
    }

    const userData = await this.userRepository.findOneBy({ id: parseInt(payload.sub as string) });
    console.log(userData);
    if (!userData) {
      throw new UnauthorizedException();
    }

    (req as any).users = UserMapper.toDomain(userData);

    return UserMapper.toDomain(userData);
  }
}
