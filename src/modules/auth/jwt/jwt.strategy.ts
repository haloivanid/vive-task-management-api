import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../../database/entities/user.typeorm-entity';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../../user/user.mapper';

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
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: any): Promise<User> {
    const userData = await this.userRepository.findOneBy({ id: parseInt(payload.sub as string) });
    if (!userData) {
      throw new UnauthorizedException();
    }

    return UserMapper.toDomain(userData);
  }
}
