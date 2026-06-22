// frontend/src/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import type { TaskStatusChangedEvent } from '../types';

export function useWebSocket(
  onStatusChanged: (event: TaskStatusChangedEvent) => void,
): {
  isConnected: boolean;
} {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      return undefined;
    }

    const socket = io('http://localhost:3000', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('task:statusChanged', onStatusChanged);

    return () => {
      socket.off('task:statusChanged', onStatusChanged);
      socket.disconnect();
    };
  }, [onStatusChanged, token]);

  return { isConnected };
}
