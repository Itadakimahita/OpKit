// src/tasks/dto/update-task.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './create-task.dto.js';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Next task status.',
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of TODO, IN_PROGRESS, DONE',
  })
  status?: TaskStatus;
}
