import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TaskTypeormEntity } from '../../../../database/entities/task.typeorm-entity';
import { ListTasksRequestDto } from '../../dto/request/list-tasks.request.dto';
import { TaskMapper } from '../../task.mapper';
import { ListTasksResponseDto } from '../../dto/response/list-tasks.response.dto';

export class ListTasksQuery {
  constructor(public readonly query: ListTasksRequestDto) {}
}

@QueryHandler(ListTasksQuery)
export class ListTasksHandler implements IQueryHandler<ListTasksQuery> {
  constructor(
    @InjectRepository(TaskTypeormEntity)
    private readonly taskRepository: Repository<TaskTypeormEntity>,
  ) {}

  async execute(query: ListTasksQuery): Promise<ListTasksResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status,
      projectId,
      assignedUserId,
    } = query.query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.where = [{ title: Like(`%${search}%`) }, { description: Like(`%${search}%`) }];
    }

    if (status) {
      where.status = status;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: tasks.map((task) => TaskMapper.fromOrmToResponseDto(task)),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    };
  }
}
