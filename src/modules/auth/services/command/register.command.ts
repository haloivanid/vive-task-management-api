import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterRequestDto } from '../../dto/request/register.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../../../database/entities/user.typeorm-entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../../../user/user.mapper';
import { ConflictException } from '@nestjs/common';

export class RegisterCommand extends Command<null> {
  constructor(public readonly registerUserDto: RegisterRequestDto) {
    super();
  }
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(@InjectRepository(UserTypeormEntity) private readonly userRepository: Repository<UserTypeormEntity>) {}
  async execute(command: RegisterCommand): Promise<null> {
    const isEmailUsed = await this.userRepository.find({ where: { email: command.registerUserDto.email } });
    if (isEmailUsed.length > 0) throw new ConflictException('Email already used');

    const ormEntity = await UserMapper.fromRegisterRequestToOrmEntity(command.registerUserDto);
    await this.userRepository.save(ormEntity);

    return null;
  }
}
