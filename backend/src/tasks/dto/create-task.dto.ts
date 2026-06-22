// src/tasks/dto/create-task.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Call Acme Corp',
    maxLength: 120,
    description: 'Task title.',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(120, { message: 'Title must not exceed 120 characters' })
  title!: string;

  @ApiPropertyOptional({
    example: 'Discuss renewal timing and next steps.',
    maxLength: 1000,
    description: 'Optional task details.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, {
    message: 'Description must not exceed 1000 characters',
  })
  description?: string;
}
