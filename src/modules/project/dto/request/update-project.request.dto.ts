import { IsString, IsOptional } from 'class-validator';

export class UpdateProjectRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
