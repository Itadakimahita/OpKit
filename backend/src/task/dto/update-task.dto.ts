import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  @IsOptional()
  status?: TaskStatus;
}
