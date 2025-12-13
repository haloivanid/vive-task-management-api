import { TaskTypeormEntity } from '../../database/entities/task.typeorm-entity';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { TaskResponseDto } from './dto/response/task.response.dto';
import { CreateTaskRequestDto } from './dto/request/create-task.request.dto';
import { UpdateTaskRequestDto } from './dto/request/updated.request.dto';

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
    ormEntity.status = domain.status;
    ormEntity.priority = domain.priority;
    ormEntity.dueDate = domain.dueDate;
    ormEntity.completedAt = domain.completedAt;
    ormEntity.position = domain.position;
    ormEntity.projectId = domain.projectId;
    ormEntity.assignedUserId = domain.assignedUserId;
    ormEntity.createdAt = domain.createdAt;
    ormEntity.updatedAt = domain.updatedAt;
    return ormEntity;
  }

  static fromDomainToResponse(task: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = task.id;
    dto.title = task.title;
    dto.description = task.description;
    dto.status = task.status;
    dto.priority = task.priority;
    dto.dueDate = task.dueDate;
    dto.completedAt = task.completedAt;
    dto.position = task.position;
    dto.projectId = task.projectId;
    dto.assignedUserId = task.assignedUserId;
    dto.createdAt = task.createdAt;
    dto.updatedAt = task.updatedAt;
    return dto;
  }

  static fromCreateRequestToOrmEntity(createDto: CreateTaskRequestDto): Partial<TaskTypeormEntity> {
    const now = new Date();
    return {
      title: createDto.title,
      description: createDto.description || null,
      status: createDto.status || TaskStatus.TODO,
      priority: createDto.priority || TaskPriority.MEDIUM,
      dueDate: createDto.dueDate || null,
      position: createDto.position || 0,
      projectId: createDto.projectId,
      assignedUserId: createDto.assignedUserId || null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  static fromUpdateRequestToOrmEntity(
    updateDto: UpdateTaskRequestDto,
    existingTask: TaskTypeormEntity,
  ): Partial<TaskTypeormEntity> {
    const updatedTask = { ...existingTask, ...updateDto };
    updatedTask.updatedAt = new Date();

    if (updateDto.status === TaskStatus.DONE && existingTask.status !== TaskStatus.DONE) {
      updatedTask.completedAt = new Date();
    } else if (updateDto.status && updateDto.status !== TaskStatus.DONE && existingTask.status === TaskStatus.DONE) {
      updatedTask.completedAt = null;
    }

    return updatedTask;
  }

  static fromOrmToResponseDto(ormEntity: TaskTypeormEntity): TaskResponseDto {
    const task = this.toDomain(ormEntity);
    return this.fromDomainToResponse(task);
  }

  static toDomainList(ormEntities: TaskTypeormEntity[]): Task[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  static toResponseDtoList(tasks: Task[]): TaskResponseDto[] {
    if (!tasks) return [];
    return tasks.map((task) => this.fromDomainToResponse(task));
  }
  toResponseDto;
}
