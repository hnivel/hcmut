import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import type { LoginRequest } from './auth.interface';
import { LoginSchema } from '@/validators/auth';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (
    loginRequest: LoginRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const { email, password } = loginRequest;

    const result = LoginSchema.safeParse(loginRequest);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      return { success: false, message: firstError };
    }

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/dashboard');
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (err) {
      const msg = (err as Error).message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  return { handleLogin };
};
