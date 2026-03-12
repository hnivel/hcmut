import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { login } from '@/services/auth/auth';
import type { LoginRequest } from './auth.interface';
import { LoginSchema } from '@/validators/auth';

export const useSignIn = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (
    loginRequest: LoginRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const { email, password } = loginRequest;

    const result = LoginSchema.safeParse(loginRequest);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      return { success: false, message: firstError };
    }

    try {
      const loginResponse = await login(email, password);

      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('authUser', JSON.stringify(loginResponse.authUser));

      setIsAuthenticated(true);
      setUser(loginResponse.authUser);

      // Use window.location to force a full page reload with updated auth state
      window.location.href = '/';
      return { success: true, message: 'Sign in successful' };
    } catch (err) {
      const msg = (err as Error).message || 'Sign in failed';
      return { success: false, message: msg };
    }
  };

  return { handleSignIn };
};
