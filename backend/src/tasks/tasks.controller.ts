// src/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../common/types/jwt-payload.type.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List current user tasks' })
  findAll(@CurrentUser() user: JwtPayload): Promise<Task[]> {
    return this.tasksService.findAll(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task for the current user' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.create(user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a current user task' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a current user task' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(id, user.sub);
  }
}
