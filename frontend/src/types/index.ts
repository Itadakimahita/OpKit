// frontend/src/types/index.ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface TaskStatusChangedEvent {
  taskId: string;
  status: TaskStatus;
  timestamp: string;
}

export interface ApiEnvelope<T> {
  data: T;
  timestamp: string;
}
