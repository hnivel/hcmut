import { useContext } from 'react';
import type { AuthContextType } from '../../contexts/auth/auth.interface';
import AuthContext from '../../contexts/auth/AuthContext';
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
