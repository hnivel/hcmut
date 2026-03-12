import api from '@/services/api';
import type { User } from './users.interface';

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get('users');
  const { userId, firstName, lastName } = res.data;
  return { userId, firstName, lastName } as User;
};
