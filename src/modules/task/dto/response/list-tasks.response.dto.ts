import { TaskResponseDto } from './task.response.dto';

export class ListTasksResponseDto {
  data: TaskResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
