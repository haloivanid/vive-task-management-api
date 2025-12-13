import { UserTypeormEntity } from '../../database/entities/user.typeorm-entity';
import { User } from './user.entity';
import { UserResponseDto } from '../auth/dto/auth-response.dto';

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
    return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
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
}
