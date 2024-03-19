import { IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  description?: string;

  @IsBoolean()
  completed?: boolean;

  @IsString()
  author?: string;
}
