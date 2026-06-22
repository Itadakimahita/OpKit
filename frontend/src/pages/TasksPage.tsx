// frontend/src/pages/TasksPage.tsx
import type { ReactElement } from 'react';
import { AddTaskForm } from '../components/AddTaskForm/AddTaskForm';
import { KanbanBoard } from '../components/KanbanBoard/KanbanBoard';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useWebSocket } from '../hooks/useWebSocket';
import styles from './TasksPage.module.css';

export function TasksPage(): ReactElement {
  const { user, logout } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    handleStatusChanged,
  } = useTasks();
  const { isConnected } = useWebSocket(handleStatusChanged);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Tasks</h1>
          <p>{user?.email}</p>
        </div>

        <div className={styles.actions}>
          <span className={styles.connection}>
            <span
              className={
                isConnected ? styles.connectedDot : styles.disconnectedDot
              }
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <AddTaskForm onCreateTask={createTask} />

      {error ? <p className={styles.error}>{error}</p> : null}
      {isLoading ? (
        <p className={styles.loading}>Loading tasks...</p>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={updateTaskStatus}
          onDelete={deleteTask}
        />
      )}
    </main>
  );
}
