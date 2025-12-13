import { UserTypeormEntity } from '../../database/entities/user.typeorm-entity';
import { User } from './user.entity';
import { RegisterRequestDto } from '../auth/dto/request/register.request.dto';
import * as bcrypt from 'bcryptjs';
import { UserResponseDto } from './dto/response/user.response.dto';

export class UserMapper {
  static toDomain(ormEntity: UserTypeormEntity): User {
    return User.reconstitute(
      ormEntity.id,
      ormEntity.name,
      ormEntity.email,
      ormEntity.password,
      ormEntity.emailVerifiedAt,
      ormEntity.rememberToken,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toResponseDto(user: User): UserResponseDto {
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }

  static toOrmEntity(domain: User): UserTypeormEntity {
    const ormEntity = new UserTypeormEntity();
    ormEntity.id = domain.id;
    ormEntity.name = domain.name;
    ormEntity.email = domain.email;
    ormEntity.password = domain.password;
    ormEntity.emailVerifiedAt = domain.emailVerifiedAt;
    ormEntity.rememberToken = domain.rememberToken;
    ormEntity.createdAt = domain.createdAt;
    ormEntity.updatedAt = domain.updatedAt;
    return ormEntity;
  }

  static toDomainList(ormEntities: UserTypeormEntity[]): User[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  static toOrmEntityList(domains: User[]): UserTypeormEntity[] {
    return domains.map((domain) => this.toOrmEntity(domain));
  }

  static async fromRegisterRequestToOrmEntity(registerDto: RegisterRequestDto): Promise<UserTypeormEntity> {
    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(registerDto.password, salt);

    const ormEntity = new UserTypeormEntity();
    ormEntity.email = registerDto.email;
    ormEntity.password = password;
    ormEntity.name = registerDto.name;
    ormEntity.createdAt = now;
    ormEntity.updatedAt = now;
    return ormEntity;
  }

  static fromOrmToResponseDto(ormEntity: UserTypeormEntity): UserResponseDto {
    return {
      id: ormEntity.id,
      email: ormEntity.email,
      name: ormEntity.name,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    };
  }
}
