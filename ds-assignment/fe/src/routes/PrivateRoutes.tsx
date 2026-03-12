import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import type { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoutes;
