// frontend/src/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as loginRequest,
  register as registerRequest,
} from '../api/auth.api';
import { TOKEN_STORAGE_KEY } from '../api/axios';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

type DecodedJwtPayload = {
  sub: string;
  email: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeUserFromToken(token: string): User | null {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(
      window.atob(normalizedPayload),
    ) as DecodedJwtPayload;

    if (!decodedPayload.sub || !decodedPayload.email) {
      return null;
    }

    return {
      id: decodedPayload.sub,
      email: decodedPayload.email,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    return storedToken ? decodeUserFromToken(storedToken) : null;
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    setUser(decodeUserFromToken(token));
  }, [token]);

  const persistToken = useCallback((accessToken: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
    setUser(decodeUserFromToken(accessToken));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const response = await loginRequest(email, password);
      persistToken(response.accessToken);
      navigate('/tasks');
    },
    [navigate, persistToken],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<void> => {
      await registerRequest(email, password);
      const response = await loginRequest(email, password);
      persistToken(response.accessToken);
      navigate('/tasks');
    },
    [navigate, persistToken],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
