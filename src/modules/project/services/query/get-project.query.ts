import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeormEntity } from '../../../../database/entities/project.typeorm-entity';
import { ProjectResponseDto } from '../../dto/response/project.response.dto';
import { ProjectMapper } from '../../project.mapper';
import { NotFoundException } from '@nestjs/common';

export class GetProjectQuery {
  constructor(public readonly projectId: number) {}
}

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(
    @InjectRepository(ProjectTypeormEntity)
    private readonly projectRepository: Repository<ProjectTypeormEntity>,
  ) {}

  async execute(query: GetProjectQuery): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id: query.projectId } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectMapper.fromOrmToResponseDto(project);
  }
}
