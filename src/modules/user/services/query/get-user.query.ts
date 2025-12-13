import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypeormEntity } from '../../../../database/entities/user.typeorm-entity';
import { UserResponseDto } from '../../dto/response/user.response.dto';
import { UserMapper } from '../../user.mapper';
import { NotFoundException } from '@nestjs/common';

export class GetUserQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly userRepository: Repository<UserTypeormEntity>,
  ) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: query.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.fromOrmToResponseDto(user);
  }
}
