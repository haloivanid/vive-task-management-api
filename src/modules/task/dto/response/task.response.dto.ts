export class TaskResponseDto {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  completedAt: Date | null;
  position: number;
  projectId: number;
  assignedUserId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
