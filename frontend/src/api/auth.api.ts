// frontend/src/api/auth.api.ts
import { api } from './axios';
import type { ApiEnvelope, AuthResponse, User } from '../types';

export async function register(
  email: string,
  password: string,
): Promise<User> {
  const response = await api.post<ApiEnvelope<User>>('/auth/register', {
    email,
    password,
  });

  return response.data.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>('/auth/login', {
    email,
    password,
  });

  return response.data.data;
}
