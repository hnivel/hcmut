import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { getCurrentUser } from '@/services/users/users';
import { signup } from '@/services/auth/auth';
import type { SignupRequest } from './auth.interface';
import { SignupSchema } from '@/validators/auth';

export const useSignup = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (
    signupRequest: SignupRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const result = SignupSchema.safeParse(signupRequest);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      return { success: false, message: firstError };
    }

    const { firstName, lastName, email, password } = signupRequest;
    try {
      const { accessToken } = await signup(
        firstName,
        lastName,
        email,
        password,
      );

      if (!accessToken) {
        return { success: false, message: 'Registration failed' };
      }

      localStorage.setItem('accessToken', accessToken);

      const user = await getCurrentUser();

      setIsAuthenticated(true);
      setUser(user);

      localStorage.setItem('authUser', JSON.stringify(user));

      navigate('/dashboard');
      return { success: true, message: 'Signup successful' };
    } catch (err) {
      const msg = (err as Error).message || 'Signup failed';
      return { success: false, message: msg };
    }
  };

  return { handleSignup };
};
