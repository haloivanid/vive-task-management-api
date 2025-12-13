import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../library/decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { CreateTaskRequestDto } from './dto/request/create-task.request.dto';
import { ListTasksRequestDto } from './dto/request/list-tasks.request.dto';
import { CreateTaskCommand } from './services/command/create-task.command';
import { DeleteTaskCommand } from './services/command/delete-task.command';
import { UpdateTaskCommand } from './services/command/update-task.command';
import { GetTaskQuery } from './services/query/get-task.query';
import { TaskResponseDto } from './dto/response/task.response.dto';
import { ListTasksResponseDto } from './dto/response/list-tasks.response.dto';
import { ListTasksQuery } from './services/query/list-task.query';
import { GetMyTasksQuery } from './services/query/get-my-task.query';
import { UpdateTaskRequestDto } from './dto/request/updated.request.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskRequestDto): Promise<TaskResponseDto> {
    return this.commandBus.execute(new CreateTaskCommand(createTaskDto));
  }

  @Get()
  async findAll(@Query() query: ListTasksRequestDto): Promise<ListTasksResponseDto> {
    return this.queryBus.execute(new ListTasksQuery(query));
  }

  @Get('me')
  async getMyTasks(@GetUser() user: User, @Query('status') status?: string): Promise<TaskResponseDto[]> {
    return this.queryBus.execute(new GetMyTasksQuery(user.id, status));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.queryBus.execute(new GetTaskQuery(parseInt(id, 10)));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskRequestDto): Promise<TaskResponseDto> {
    return this.commandBus.execute(new UpdateTaskCommand(parseInt(id, 10), updateTaskDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTaskCommand(parseInt(id, 10)));
  }
}
