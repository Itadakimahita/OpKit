// frontend/src/pages/RegisterPage.tsx
import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export function RegisterPage(): ReactElement {
  const { register, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register(email, password);
    } catch {
      setError('Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <h1>Create account</h1>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>

        {error ? <p className={styles.error}>{error}</p> : null}

        <p className={styles.switch}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
