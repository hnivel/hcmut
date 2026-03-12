import type { User } from '@/services/users/users.interface';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}
