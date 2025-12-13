import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeormEntity } from '../../../../database/entities/project.typeorm-entity';
import { UpdateProjectRequestDto } from '../../dto/request/update-project.request.dto';
import { ProjectResponseDto } from '../../dto/response/project.response.dto';
import { ProjectMapper } from '../../project.mapper';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class UpdateProjectCommand {
  constructor(
    public readonly projectId: number,
    public readonly projectData: UpdateProjectRequestDto,
  ) {}
}

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @InjectRepository(ProjectTypeormEntity)
    private readonly projectRepository: Repository<ProjectTypeormEntity>,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectResponseDto> {
    const { projectId, projectData } = command;

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (projectData.name && projectData.name !== project.name) {
      const existingProject = await this.projectRepository.findOne({ where: { name: projectData.name } });
      if (existingProject) {
        throw new ConflictException('Project with this name already exists');
      }
    }

    const updatedProject = ProjectMapper.fromUpdateRequestToOrmEntity(projectData, project);
    const savedProject = await this.projectRepository.save(updatedProject);

    return ProjectMapper.fromOrmToResponseDto(savedProject);
  }
}
