import { TaskTypeormEntity } from '../../database/entities/task.typeorm-entity';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { stringToEnum } from '../../library/helpers/string-to-enum.helper';

export class TaskMapper {
  static toDomain(ormEntity: TaskTypeormEntity): Task {
    return Task.reconstitute(
      ormEntity.id,
      ormEntity.title,
      ormEntity.projectId,
      ormEntity.status as TaskStatus,
      ormEntity.priority as TaskPriority,
      ormEntity.description,
      ormEntity.dueDate,
      ormEntity.position,
      ormEntity.assignedUserId,
      ormEntity.completedAt,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrmEntity(domain: Task): TaskTypeormEntity {
    const ormEntity = new TaskTypeormEntity();
    ormEntity.id = domain.id;
    ormEntity.title = domain.title;
    ormEntity.description = domain.description;
    ormEntity.status = stringToEnum(TaskStatus, domain.status, TaskStatus.TODO);
    ormEntity.priority = stringToEnum(TaskPriority, domain.priority, TaskPriority.MEDIUM);
    ormEntity.dueDate = domain.dueDate;
    ormEntity.completedAt = domain.completedAt;
    ormEntity.position = domain.position;
    ormEntity.projectId = domain.projectId;
    ormEntity.assignedUserId = domain.assignedUserId;
    ormEntity.createdAt = domain.createdAt;
    ormEntity.updatedAt = domain.updatedAt;
    return ormEntity;
  }

  static toDomainList(ormEntities: TaskTypeormEntity[]): Task[] {
    if (ormEntities === null || ormEntities.length === 0) return [];
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  static toOrmEntityList(domains: Task[]): TaskTypeormEntity[] {
    return domains.map((domain) => this.toOrmEntity(domain));
  }
}
