// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TasksController } from './tasks.controller.js';
import { TasksGateway } from './tasks.gateway.js';
import { TasksService } from './tasks.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, TasksGateway],
})
export class TasksModule {}
