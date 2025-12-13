import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProjectTypeormEntity } from '../../../../database/entities/project.typeorm-entity';
import { ListProjectsRequestDto } from '../../dto/request/list-projects.request.dto';
import { ListProjectsResponse, ProjectResponseDto } from '../../dto/response/project.response.dto';
import { ProjectMapper } from '../../project.mapper';

export class GetProjectsQuery {
  constructor(public readonly query: ListProjectsRequestDto) {}
}

@QueryHandler(GetProjectsQuery)
export class GetProjectsQueryHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @InjectRepository(ProjectTypeormEntity)
    private readonly projectRepository: Repository<ProjectTypeormEntity>,
  ) {}

  async execute(query: GetProjectsQuery): Promise<ListProjectsResponse> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query.query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.where = [{ name: Like(`%${search}%`) }, { description: Like(`%${search}%`) }];
    }

    const [projects, total] = await this.projectRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects.map((project) => ProjectMapper.fromOrmToResponseDto(project)),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    };
  }
}
