import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectRequestDto } from './dto/request/create-project.request.dto';
import { UpdateProjectRequestDto } from './dto/request/update-project.request.dto';
import { ListProjectsRequestDto } from './dto/request/list-projects.request.dto';
import { ProjectResponseDto, ListProjectsResponse } from './dto/response/project.response.dto';
import { CreateProjectCommand } from './services/command/create-project.command';
import { UpdateProjectCommand } from './services/command/update-project.command';
import { DeleteProjectCommand } from './services/command/delete-project.command';
import { GetProjectQuery } from './services/query/get-project.query';
import { GetProjectsQuery } from './services/query/get-projects.query';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    return this.commandBus.execute(new CreateProjectCommand(createProjectDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.queryBus.execute(new GetProjectQuery(parseInt(id, 10)));
  }

  @Get()
  async findAll(@Query() query: ListProjectsRequestDto): Promise<ListProjectsResponse> {
    return this.queryBus.execute(new GetProjectsQuery(query));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    return this.commandBus.execute(new UpdateProjectCommand(parseInt(id, 10), updateProjectDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteProjectCommand(parseInt(id, 10)));
  }
}
