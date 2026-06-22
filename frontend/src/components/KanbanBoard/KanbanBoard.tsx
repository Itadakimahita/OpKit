// frontend/src/components/KanbanBoard/KanbanBoard.tsx
import type { ReactElement } from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const columns: Array<{ status: TaskStatus; label: string }> = [
  { status: 'TODO', label: 'TODO' },
  { status: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { status: 'DONE', label: 'DONE' },
];

export function KanbanBoard({
  tasks,
  onStatusChange,
  onDelete,
}: KanbanBoardProps): ReactElement {
  return (
    <section className={styles.board} aria-label="Task kanban board">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <div className={styles.column} key={column.status}>
            <header className={styles.columnHeader}>
              <h2>{column.label}</h2>
              <span>{columnTasks.length}</span>
            </header>

            <div className={styles.taskList}>
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
