import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ProjectTypeormEntity } from './project.typeorm-entity';
import { TaskTypeormEntity } from './task.typeorm-entity';

@Entity('users')
export class UserTypeormEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt: Date | null;

  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'remember_token' })
  @Exclude()
  rememberToken: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProjectTypeormEntity, (project) => project.owner)
  ownedProjects: ProjectTypeormEntity[];

  @OneToMany(() => TaskTypeormEntity, (task) => task.assignedUser)
  tasks: TaskTypeormEntity[];
}
