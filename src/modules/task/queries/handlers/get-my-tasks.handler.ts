import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { Task } from '../../task.entity';
import { TaskMapper } from '../../task.mapper';
import { GetMyTasksQuery } from '../../dto/get-my-tasks.query';

@QueryHandler(GetMyTasksQuery)
export class GetMyTasksHandler implements IQueryHandler<GetMyTasksQuery> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(query: GetMyTasksQuery): Promise<Task[]> {
    const { userId, status } = query;

    const where: FindOptionsWhere<TaskTypeormEntity> = { assignedUserId: userId };
    if (status) {
      where.status = status;
    }

    const tasks = await this.taskRepository.find({ where, order: { position: 'ASC', createdAt: 'DESC' } });

    return TaskMapper.toDomainList(tasks);
  }
}
