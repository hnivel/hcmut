import type { User } from '@/services/users/users.interface';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}
