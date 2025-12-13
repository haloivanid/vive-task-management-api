import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserTypeormEntity } from './user.typeorm-entity';
import { TaskTypeormEntity } from './task.typeorm-entity';

@Entity('projects')
export class ProjectTypeormEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  color: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserTypeormEntity, (user) => user.ownedProjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: UserTypeormEntity;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @OneToMany(() => TaskTypeormEntity, (task) => task.project)
  tasks: TaskTypeormEntity[];

  updateDetails(updates: Partial<Pick<ProjectTypeormEntity, 'name' | 'description' | 'color'>>): void {
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.color !== undefined) this.color = updates.color;
  }

  isOwnedBy(userId: number): boolean {
    return this.ownerId === userId;
  }

  static create(owner: UserTypeormEntity, name: string, description?: string, color?: string): ProjectTypeormEntity {
    const project = new ProjectTypeormEntity();
    project.owner = owner;
    project.ownerId = owner.id;
    project.name = name;
    project.description = description || null;
    project.color = color || null;
    return project;
  }
}
