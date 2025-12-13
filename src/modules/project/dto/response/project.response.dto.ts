export class ProjectResponseDto {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListProjectsResponse {
  data: ProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
