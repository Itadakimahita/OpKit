// src/tasks/tasks.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskStatus } from '@prisma/client';

type TaskStatusChangedPayload = {
  taskId: string;
  status: TaskStatus;
  timestamp: string;
};

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class TasksGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  notifyStatusChanged(taskId: string, status: TaskStatus): void {
    const payload: TaskStatusChangedPayload = {
      taskId,
      status,
      timestamp: new Date().toISOString(),
    };

    this.server.emit('task:statusChanged', payload);
  }

  handleConnection(client: Socket): void {
    console.log(`WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`WebSocket client disconnected: ${client.id}`);
  }
}
