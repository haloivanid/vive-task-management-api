import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeormEntity } from '../../../../database/entities/project.typeorm-entity';
import { NotFoundException } from '@nestjs/common';

export class DeleteProjectCommand {
  constructor(public readonly projectId: number) {}
}

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @InjectRepository(ProjectTypeormEntity)
    private readonly projectRepository: Repository<ProjectTypeormEntity>,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const { projectId } = command;

    const result = await this.projectRepository.delete(projectId);

    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
