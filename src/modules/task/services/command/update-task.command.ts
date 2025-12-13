import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { TaskResponseDto } from '../../dto/response/task.response.dto';
import { TaskMapper } from '../../task.mapper';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskRequestDto } from '../../dto/request/updated.request.dto';

export class UpdateTaskCommand {
  constructor(
    public readonly taskId: number,
    public readonly taskData: UpdateTaskRequestDto,
  ) {}
}

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<TaskResponseDto> {
    const { taskId, taskData } = command;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (command.taskData.position && task.position !== command.taskData.position) {
      const otherTask = await this.taskRepository.findOne({ where: { id: command.taskData.position } });
      if (otherTask) {
        otherTask.position = task.position;
        await this.taskRepository.save(otherTask);
      }
    }

    const updatedTask = TaskMapper.fromUpdateRequestToOrmEntity(taskData, task);
    const savedTask = await this.taskRepository.save(updatedTask);

    return TaskMapper.fromOrmToResponseDto(savedTask);
  }
}
