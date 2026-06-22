// frontend/src/components/TaskCard/TaskCard.tsx
import type { ReactElement } from 'react';
import type { Task, TaskStatus } from '../../types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: TaskCardProps): ReactElement {
  const badgeClassName = `${styles.badge} ${styles[task.status]}`;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3>{task.title}</h3>
        <span className={badgeClassName}>{task.status.replace('_', ' ')}</span>
      </div>

      {task.description ? (
        <p className={styles.description}>{task.description}</p>
      ) : null}

      <div className={styles.actions}>
        {task.status === 'TODO' ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => void onStatusChange(task.id, 'IN_PROGRESS')}
          >
            ▶ Start
          </button>
        ) : null}

        {task.status === 'IN_PROGRESS' ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => void onStatusChange(task.id, 'DONE')}
          >
            ✓ Done
          </button>
        ) : null}

        <button
          type="button"
          className={styles.deleteButton}
          aria-label={`Delete ${task.title}`}
          onClick={() => void onDelete(task.id)}
        >
          🗑
        </button>
      </div>
    </article>
  );
}
