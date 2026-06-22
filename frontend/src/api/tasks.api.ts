// frontend/src/api/tasks.api.ts
import { api } from './axios';
import type { ApiEnvelope, Task } from '../types';

type UpdateTaskPayload = Partial<Pick<Task, 'title' | 'description' | 'status'>>;

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<ApiEnvelope<Task[]>>('/tasks');
  return response.data.data;
}

export async function createTask(
  title: string,
  description?: string,
): Promise<Task> {
  const response = await api.post<ApiEnvelope<Task>>('/tasks', {
    title,
    description,
  });

  return response.data.data;
}

export async function updateTask(
  id: string,
  data: UpdateTaskPayload,
): Promise<Task> {
  const response = await api.patch<ApiEnvelope<Task>>(`/tasks/${id}`, data);
  return response.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete<ApiEnvelope<{ message: string }>>(`/tasks/${id}`);
}
