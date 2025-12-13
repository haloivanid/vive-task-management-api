import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserTypeormEntity } from './user.typeorm-entity';
import { ProjectTypeormEntity } from './project.typeorm-entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ARCHIVED = 'archived',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
@Index(['projectId', 'dueDate'])
@Index(['assignedUserId', 'status'])
export class TaskTypeormEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: false })
  status: string;

  @Column({ type: 'text', nullable: false })
  priority: string;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt: Date | null;

  @Column({ type: 'integer', name: 'position', default: 0 })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ProjectTypeormEntity, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectTypeormEntity;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => UserTypeormEntity, (user) => user.tasks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_user_id' })
  assignedUser: UserTypeormEntity | null;

  @Column({ name: 'assigned_user_id', nullable: true })
  assignedUserId: number | null;

  assignTo(user: UserTypeormEntity): void {
    this.assignedUser = user;
    this.assignedUserId = user.id;
  }

  unassign(): void {
    this.assignedUser = null;
    this.assignedUserId = null;
  }

  updateStatus(status: TaskStatus): void {
    this.status = status;
    if (status === TaskStatus.DONE) {
      this.completedAt = new Date();
    }
  }

  updateDetails(updates: Partial<Pick<TaskTypeormEntity, 'title' | 'description' | 'dueDate' | 'priority'>>): void {
    if (updates.title !== undefined) this.title = updates.title;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.dueDate !== undefined) this.dueDate = updates.dueDate;
    if (updates.priority !== undefined) this.priority = updates.priority;
  }

  static create(
    project: ProjectTypeormEntity,
    title: string,
    assignedUser?: UserTypeormEntity,
    options: { description?: string; dueDate?: Date | null; priority?: TaskPriority; status?: TaskStatus } = {},
  ): TaskTypeormEntity {
    const task = new TaskTypeormEntity();
    task.project = project;
    task.projectId = project.id;
    task.title = title;
    task.description = options.description || null;
    task.dueDate = options.dueDate || null;
    task.priority = options.priority || TaskPriority.MEDIUM;
    task.status = options.status || TaskStatus.TODO;

    if (assignedUser) {
      task.assignedUser = assignedUser;
      task.assignedUserId = assignedUser.id;
    }

    return task;
  }
}
