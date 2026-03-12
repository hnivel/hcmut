import { useEffect, useState, type JSX, type ReactNode } from 'react';
import AuthContext from './AuthContext';
import type { AuthContextType } from './auth.interface';
import type { User } from '@/services/users/users.interface';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('authUser');

    if (userData) {
      setIsAuthenticated(true);
      setAccessToken(token);
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error when parsing user from localStorage', err);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    }

    setIsLoading(false);
  }, []);

  const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    isLoading,
    setIsAuthenticated,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
