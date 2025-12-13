import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeormEntity } from '../../../../database/entities/project.typeorm-entity';
import { CreateProjectRequestDto } from '../../dto/request/create-project.request.dto';
import { ProjectResponseDto } from '../../dto/response/project.response.dto';
import { ProjectMapper } from '../../project.mapper';
import { ConflictException } from '@nestjs/common';

export class CreateProjectCommand {
  constructor(public readonly projectData: CreateProjectRequestDto) {}
}

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @InjectRepository(ProjectTypeormEntity)
    private readonly projectRepository: Repository<ProjectTypeormEntity>,
  ) {}

  async execute(command: CreateProjectCommand): Promise<ProjectResponseDto> {
    const { projectData } = command;

    const existingProject = await this.projectRepository.findOne({ where: { name: projectData.name } });

    if (existingProject) {
      throw new ConflictException('Project with this name already exists');
    }

    const projectEntity = ProjectMapper.fromCreateRequestToOrmEntity(projectData);
    const savedProject = await this.projectRepository.save(projectEntity);

    return ProjectMapper.fromOrmToResponseDto(savedProject);
  }
}
