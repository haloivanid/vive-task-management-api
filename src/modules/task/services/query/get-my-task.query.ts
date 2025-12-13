import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { TaskResponseDto } from '../../dto/response/task.response.dto';
import { TaskMapper } from '../../task.mapper';

export class GetMyTasksQuery {
  constructor(
    public readonly userId: number,
    public readonly status?: string,
  ) {}
}

@QueryHandler(GetMyTasksQuery)
export class GetMyTasksHandler implements IQueryHandler<GetMyTasksQuery> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(query: GetMyTasksQuery): Promise<TaskResponseDto[]> {
    const { userId, status } = query;

    const where: any = { assignedUserId: userId };

    if (status) {
      where.status = status;
    }

    const tasks = await this.taskRepository.find({ where });
    return tasks.map((task) => TaskMapper.fromOrmToResponseDto(task));
  }
}
