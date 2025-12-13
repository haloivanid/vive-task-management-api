import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeormEntity } from '../../database/entities/project.typeorm-entity';
import { ProjectController } from './project.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProjectHandler } from './services/command/create-project.command';
import { UpdateProjectHandler } from './services/command/update-project.command';
import { DeleteProjectHandler } from './services/command/delete-project.command';
import { GetProjectHandler } from './services/query/get-project.query';
import { ProjectMapper } from './project.mapper';
import { GetProjectsQueryHandler } from './services/query/get-projects.query';
import { JwtAuthModule } from '../auth/jwt/jwt.module';

const CommandHandlers = [CreateProjectHandler, UpdateProjectHandler, DeleteProjectHandler];

const QueryHandlers = [GetProjectHandler, GetProjectsQueryHandler];

@Module({
  imports: [JwtAuthModule, TypeOrmModule.forFeature([ProjectTypeormEntity]), CqrsModule],
  controllers: [ProjectController],
  providers: [...CommandHandlers, ...QueryHandlers, ProjectMapper],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
