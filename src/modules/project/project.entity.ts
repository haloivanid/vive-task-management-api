export class Project {
  private readonly _id: number;
  private _name: string;
  private _description: string | null;
  private _color: string | null;
  private _ownerId: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: number,
    name: string,
    ownerId: number,
    description: string | null = null,
    color: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._color = color;
    this._ownerId = ownerId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(name: string, ownerId: number, description?: string, color?: string, id?: number): Project {
    if (!name || !ownerId) {
      throw new Error('Name and ownerId are required');
    }

    if (id === undefined) {
      throw new Error('ID is required for Project creation');
    }

    return new Project(id, name, ownerId, description || null, color || null);
  }

  static reconstitute(
    id: number,
    name: string,
    ownerId: number,
    description: string | null,
    color: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Project {
    return new Project(id, name, ownerId, description, color, createdAt, updatedAt);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get color(): string | null {
    return this._color;
  }

  get ownerId(): number {
    return this._ownerId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDetails(updates: { name?: string; description?: string | null; color?: string | null }): void {
    if (updates.name !== undefined) {
      this._name = updates.name;
    }
    if (updates.description !== undefined) {
      this._description = updates.description;
    }
    if (updates.color !== undefined) {
      this._color = updates.color;
    }
    this._updatedAt = new Date();
  }

  isOwnedBy(userId: number): boolean {
    return this._ownerId === userId;
  }
}
