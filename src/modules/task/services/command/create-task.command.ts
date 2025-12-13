import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { CreateTaskRequestDto } from '../../dto/request/create-task.request.dto';
import { TaskResponseDto } from '../../dto/response/task.response.dto';
import { TaskMapper } from '../../task.mapper';

export class CreateTaskCommand {
  constructor(public readonly taskData: CreateTaskRequestDto) {}
}

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskResponseDto> {
    const { taskData } = command;

    const taskEntity = TaskMapper.fromCreateRequestToOrmEntity(taskData);
    const savedTask = await this.taskRepository.save(taskEntity);

    return TaskMapper.fromOrmToResponseDto(savedTask);
  }
}
