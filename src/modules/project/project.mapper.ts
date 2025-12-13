import { ProjectTypeormEntity } from '../../database/entities/project.typeorm-entity';
import { Project } from './project.entity';
import { ProjectResponseDto } from './dto/response/project.response.dto';
import { CreateProjectRequestDto } from './dto/request/create-project.request.dto';
import { UpdateProjectRequestDto } from './dto/request/update-project.request.dto';

export class ProjectMapper {
  static toDomain(ormEntity: ProjectTypeormEntity): Project {
    return Project.reconstitute(
      ormEntity.id,
      ormEntity.name,
      ormEntity.ownerId,
      ormEntity.description,
      ormEntity.color,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  static fromCreateRequestToOrmEntity(createDto: CreateProjectRequestDto): Partial<ProjectTypeormEntity> {
    const now = new Date();
    return { name: createDto.name, description: createDto.description, createdAt: now, updatedAt: now };
  }

  static fromUpdateRequestToOrmEntity(
    updateDto: UpdateProjectRequestDto,
    existingProject: ProjectTypeormEntity,
  ): Partial<ProjectTypeormEntity> {
    return {
      ...existingProject,
      name: updateDto.name ?? existingProject.name,
      description: updateDto.description ?? existingProject.description,
      updatedAt: new Date(),
    };
  }

  static fromOrmToResponseDto(ormEntity: ProjectTypeormEntity): ProjectResponseDto {
    return {
      id: ormEntity.id,
      name: ormEntity.name,
      description: ormEntity.description,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    };
  }

  static toOrmEntity(project: Project): ProjectTypeormEntity {
    const ormEntity = new ProjectTypeormEntity();
    ormEntity.id = project.id;
    ormEntity.name = project.name;
    ormEntity.description = project.description;
    ormEntity.createdAt = project.createdAt;
    ormEntity.updatedAt = project.updatedAt;
    return ormEntity;
  }
}
