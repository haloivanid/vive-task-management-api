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

export class Task {
  private readonly _id: number;
  private _title: string;
  private _description: string | null;
  private _status: TaskStatus;
  private _priority: TaskPriority;
  private _dueDate: Date | null;
  private _completedAt: Date | null;
  private _position: number;
  private _projectId: number;
  private _assignedUserId: number | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: number,
    title: string,
    projectId: number,
    status: TaskStatus = TaskStatus.TODO,
    priority: TaskPriority = TaskPriority.MEDIUM,
    description: string | null = null,
    dueDate: Date | null = null,
    position: number = 0,
    assignedUserId: number | null = null,
    completedAt: Date | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._title = title;
    this._projectId = projectId;
    this._status = status;
    this._priority = priority;
    this._description = description;
    this._dueDate = dueDate;
    this._position = position;
    this._assignedUserId = assignedUserId;
    this._completedAt = completedAt;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    title: string,
    projectId: number,
    assignedUserId: number | null = null,
    options: {
      description?: string;
      dueDate?: Date | null;
      priority?: TaskPriority;
      status?: TaskStatus;
      position?: number;
    } = {},
    id?: number,
  ): Task {
    if (!title || !projectId) {
      throw new Error('Title and projectId are required');
    }

    if (id === undefined) {
      throw new Error('ID is required for Task creation');
    }

    return new Task(
      id,
      title,
      projectId,
      options.status || TaskStatus.TODO,
      options.priority || TaskPriority.MEDIUM,
      options.description || null,
      options.dueDate || null,
      options.position || 0,
      assignedUserId,
      options.status === TaskStatus.DONE ? new Date() : null,
    );
  }

  static reconstitute(
    id: number,
    title: string,
    projectId: number,
    status: TaskStatus,
    priority: TaskPriority,
    description: string | null,
    dueDate: Date | null,
    position: number,
    assignedUserId: number | null,
    completedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ): Task {
    return new Task(
      id,
      title,
      projectId,
      status,
      priority,
      description,
      dueDate,
      position,
      assignedUserId,
      completedAt,
      createdAt,
      updatedAt,
    );
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get position(): number {
    return this._position;
  }

  get projectId(): number {
    return this._projectId;
  }

  get assignedUserId(): number | null {
    return this._assignedUserId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain methods
  updateDetails(updates: {
    title?: string;
    description?: string | null;
    dueDate?: Date | null;
    priority?: TaskPriority;
    position?: number;
  }): void {
    if (updates.title !== undefined) this._title = updates.title;
    if (updates.description !== undefined) this._description = updates.description;
    if (updates.dueDate !== undefined) this._dueDate = updates.dueDate;
    if (updates.priority !== undefined) this._priority = updates.priority;
    if (updates.position !== undefined) this._position = updates.position;
    this._updatedAt = new Date();
  }

  updateStatus(status: TaskStatus): void {
    this._status = status;
    if (status === TaskStatus.DONE && !this._completedAt) {
      this._completedAt = new Date();
    } else if (status !== TaskStatus.DONE) {
      this._completedAt = null;
    }
    this._updatedAt = new Date();
  }

  assignTo(userId: number): void {
    this._assignedUserId = userId;
    this._updatedAt = new Date();
  }

  unassign(): void {
    this._assignedUserId = null;
    this._updatedAt = new Date();
  }

  isAssignedTo(userId: number): boolean {
    return this._assignedUserId === userId;
  }

  isCompleted(): boolean {
    return this._status === TaskStatus.DONE;
  }

  isOverdue(): boolean {
    return this._dueDate !== null && this._dueDate < new Date() && !this.isCompleted();
  }
}
