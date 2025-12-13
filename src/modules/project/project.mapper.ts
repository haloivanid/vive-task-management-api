import { ProjectTypeormEntity } from '../../database/entities/project.typeorm-entity';
import { Project } from './project.entity';

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

  static toOrmEntity(domain: Project): ProjectTypeormEntity {
    const ormEntity = new ProjectTypeormEntity();
    ormEntity.id = domain.id;
    ormEntity.name = domain.name;
    ormEntity.description = domain.description;
    ormEntity.color = domain.color;
    ormEntity.ownerId = domain.ownerId;
    ormEntity.createdAt = domain.createdAt;
    ormEntity.updatedAt = domain.updatedAt;
    return ormEntity;
  }

  static toDomainList(ormEntities: ProjectTypeormEntity[]): Project[] {
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  static toOrmEntityList(domains: Project[]): ProjectTypeormEntity[] {
    return domains.map((domain) => this.toOrmEntity(domain));
  }
}
