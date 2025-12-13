import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { NotFoundException } from '@nestjs/common';

export class DeleteTaskCommand {
  constructor(public readonly taskId: number) {}
}

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { taskId } = command;
    const result = await this.taskRepository.delete(taskId);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
