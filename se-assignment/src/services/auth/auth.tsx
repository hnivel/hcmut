import { API_BASE_URL } from '@/constants';
import axios from 'axios';
import type { LoginResponse, SignupResponse } from './auth.interface';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await authApi.post<LoginResponse>('auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<SignupResponse> => {
  try {
    const response = await authApi.post<SignupResponse>('auth/register', {
      lastName,
      firstName,
      email,
      password,
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
