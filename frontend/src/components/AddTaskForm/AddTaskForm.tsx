// frontend/src/components/AddTaskForm/AddTaskForm.tsx
import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import styles from './AddTaskForm.module.css';

interface AddTaskFormProps {
  onCreateTask: (title: string, description?: string) => Promise<void>;
}

export function AddTaskForm({
  onCreateTask,
}: AddTaskFormProps): ReactElement {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateTask(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
    } catch {
      setError('Unable to add task');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <div className={styles.fields}>
        <label>
          <span>Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Follow up with client"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details"
            rows={2}
          />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>

      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
