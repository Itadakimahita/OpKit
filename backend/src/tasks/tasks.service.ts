// src/tasks/tasks.service.ts
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TasksGateway } from './tasks.gateway.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: TasksGateway,
  ) {}

  async findAll(userId: string): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          userId,
        },
      });
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOneOrFail(id, userId);

      if (dto.status) {
        this.validateStatusTransition(task.status, dto.status);
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: task.id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
        },
      });

      if (dto.status && task.status !== updatedTask.status) {
        this.gateway.notifyStatusChanged(updatedTask.id, updatedTask.status);
      }

      return updatedTask;
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    try {
      const task = await this.findOneOrFail(id, userId);

      await this.prisma.task.delete({
        where: { id: task.id },
      });

      return { message: 'Task deleted' };
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  private async findOneOrFail(id: string, userId: string): Promise<Task> {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id, userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  private validateStatusTransition(
    current: TaskStatus,
    next: TaskStatus,
  ): void {
    if (current === next) {
      return;
    }

    const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.DONE],
      [TaskStatus.DONE]: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${next}`,
      );
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Task not found');
    }

    throw new InternalServerErrorException('Task request failed');
  }
}
