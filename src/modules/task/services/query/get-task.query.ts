import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { TaskResponseDto } from '../../dto/response/task.response.dto';
import { TaskMapper } from '../../task.mapper';
import { NotFoundException } from '@nestjs/common';

export class GetTaskQuery {
  constructor(public readonly taskId: number) {}
}

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(query: GetTaskQuery): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id: query.taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return TaskMapper.fromOrmToResponseDto(task);
  }
}
