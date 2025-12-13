import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';

@Controller('projects')
export class ProjectController {
  @Get()
  async getProjects(): Promise<any[]> {}

  @Get('/:id')
  async getProject(@Param('id') id: string): Promise<any> {}

  @Post()
  async create(@Body() any) {}

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() any) {}

  @Delete('/:id')
  async destroy(@Param('id') id: string) {}
}
