import api from '@/services/api';
import type { User } from './users.interface';

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get('users');
  return res.data as User;
};
