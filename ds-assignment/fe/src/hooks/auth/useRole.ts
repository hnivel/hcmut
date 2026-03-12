import { useAuth } from './useAuth';
import type { UserRole } from '@/services/users/users.interface';

export const useRole = () => {
  const { user } = useAuth();

  const userRole: UserRole = user?.role ?? 'customer';
  const isCustomer = userRole === 'customer';
  const isDriver = userRole === 'driver';
  const isRestaurant = userRole === 'restaurant_owner';
  const isAdmin = userRole === 'admin';

  return {
    userRole,
    isCustomer,
    isDriver,
    isRestaurant,
    isAdmin,
  };
};
