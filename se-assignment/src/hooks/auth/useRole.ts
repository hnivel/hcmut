import { useAuth } from './useAuth';
import type { UserRole } from '@/services/users/users.interface';

export const useRole = () => {
  const { user } = useAuth();

  const userRole: UserRole = user?.role || 'mentee';
  const isMentor = userRole === 'mentor';
  const isMentee = userRole === 'mentee';
  const isFaculty = userRole === 'faculty';

  return {
    userRole,
    isMentor,
    isMentee,
    isFaculty,
  };
};
