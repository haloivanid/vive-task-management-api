import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUser } from '../../library/decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { GetMyTasksQuery } from './dto/get-my-tasks.query';
import { Task } from './task.entity';

@Controller('tasks')
@UseGuards()
export class TaskController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/me')
  async getMyTasks(@GetUser() user: User, @Query('status') status?: string): Promise<Task[]> {
    return this.queryBus.execute(new GetMyTasksQuery(user.id, status));
  }
}
