// frontend/src/pages/LoginPage.tsx
import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export function LoginPage(): ReactElement {
  const { login, isAuthenticated } = useAuth();
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
      await login(email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <h1>Sign in</h1>

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
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        {error ? <p className={styles.error}>{error}</p> : null}

        <p className={styles.switch}>
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}
