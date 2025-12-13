import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
