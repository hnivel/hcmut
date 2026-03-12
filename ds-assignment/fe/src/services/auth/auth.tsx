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
  name: string,
  email: string,
  password: string,
  role: 'customer' | 'driver' | 'restaurant_owner',
  phone?: string,
  recommendedCustomerId?: string,
): Promise<SignupResponse> => {
  try {
    // Split name into firstName and lastName for backend
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

    const response = await authApi.post<SignupResponse>('auth/register', {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      recommendedCustomerId,
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
};
