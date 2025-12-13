import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../../../database/entities/user.typeorm-entity';
import { Repository } from 'typeorm';
import { LoginResponseDto } from '../../dto/response/login.response.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserMapper } from '../../../user/user.mapper';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../jwt/jwt.payload';
import { instanceToPlain } from 'class-transformer';

export class LoginQuery extends Query<LoginResponseDto> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(
    @InjectRepository(UserTypeormEntity) private readonly userRepository: Repository<UserTypeormEntity>,
    private readonly jwt: JwtService,
  ) {}

  async execute(query: LoginQuery): Promise<LoginResponseDto> {
    const userDataDB = await this.userRepository.findOne({ where: { email: query.email } });
    if (!userDataDB) throw new NotFoundException();

    const userEntity = UserMapper.toDomain(userDataDB);
    const isValidaPassword = userEntity.validatePassword(query.password);
    if (!isValidaPassword) throw new UnauthorizedException();

    const payload = new JwtPayload(userEntity);
    const accessToken = this.jwt.sign(instanceToPlain(payload));
    const expiresIn = Date.now();
    return { accessToken, expiresIn };
  }
}
