import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from '../../task.entity';

export class ListTasksRequestDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsNumber()
  @IsOptional()
  projectId?: number;

  @IsNumber()
  @IsOptional()
  assignedUserId?: number;
}
