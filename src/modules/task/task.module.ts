import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypeormEntity } from '../../database/entities/task.typeorm-entity';
import { TaskController } from './task.controller';
import { TaskMapper } from './task.mapper';
import { GetMyTasksHandler } from './queries/handlers/get-my-tasks.handler';

const QueryHandlers = [GetMyTasksHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TaskTypeormEntity])],
  controllers: [TaskController],
  providers: [TaskMapper, ...QueryHandlers],
  exports: [TaskMapper],
})
export class TaskModule {}
