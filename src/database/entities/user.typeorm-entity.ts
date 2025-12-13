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
import * as bcrypt from 'bcrypt';
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

  // Relations
  @OneToMany(() => ProjectTypeormEntity, (project) => project.owner)
  ownedProjects: ProjectTypeormEntity[];

  @OneToMany(() => TaskTypeormEntity, (task) => task.assignedUser)
  tasks: TaskTypeormEntity[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Helper methods
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  hasVerifiedEmail(): boolean {
    return this.emailVerifiedAt !== null;
  }

  markEmailAsVerified(): void {
    this.emailVerifiedAt = new Date();
  }

  // For password reset functionality
  getEmailForPasswordReset(): { email: string; name: string } {
    return { email: this.email, name: this.name };
  }
}
