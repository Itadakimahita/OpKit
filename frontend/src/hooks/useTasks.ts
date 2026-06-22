// frontend/src/hooks/useTasks.ts
import { useCallback, useEffect, useState } from 'react';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask,
} from '../api/tasks.api';
import type { Task, TaskStatus, TaskStatusChangedEvent } from '../types';

export function useTasks(): {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (title: string, description?: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  handleStatusChanged: (event: TaskStatusChangedEvent) => void;
} {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks(): Promise<void> {
      try {
        const loadedTasks = await getTasks();

        if (isMounted) {
          setTasks(loadedTasks);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load tasks');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const createTask = useCallback(
    async (title: string, description?: string): Promise<void> => {
      const optimisticTask: Task = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        description,
        status: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user',
      };

      setTasks((currentTasks) => [optimisticTask, ...currentTasks]);

      try {
        const createdTask = await createTaskRequest(title, description);
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === optimisticTask.id ? createdTask : task,
          ),
        );
        setError(null);
      } catch {
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== optimisticTask.id),
        );
        setError('Unable to create task');
        throw new Error('Unable to create task');
      }
    },
    [],
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus): Promise<void> => {
      const previousTasks = tasks;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task,
        ),
      );

      try {
        const updatedTask = await updateTask(id, { status });
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === id ? updatedTask : task)),
        );
        setError(null);
      } catch {
        setTasks(previousTasks);
        setError('Unable to update task status');
      }
    },
    [tasks],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      const previousTasks = tasks;

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));

      try {
        await deleteTaskRequest(id);
        setError(null);
      } catch {
        setTasks(previousTasks);
        setError('Unable to delete task');
      }
    },
    [tasks],
  );

  const handleStatusChanged = useCallback(
    (event: TaskStatusChangedEvent): void => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === event.taskId
            ? {
                ...task,
                status: event.status,
                updatedAt: event.timestamp,
              }
            : task,
        ),
      );
    },
    [],
  );

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    handleStatusChanged,
  };
}
