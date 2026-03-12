import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { signup } from '@/services/auth/auth';
import type { SignupRequest } from './auth.interface';
import { SignupSchema } from '@/validators/auth';

export const useSignUp = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (
    signupRequest: SignupRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const result = SignupSchema.safeParse(signupRequest);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      return { success: false, message: firstError };
    }

    const { name, email, password, role, phone, recommendedCustomerId } =
      signupRequest;
    try {
      const signupResponse = await signup(
        name,
        email,
        password,
        role,
        phone,
        recommendedCustomerId,
      );

      if (!signupResponse.accessToken) {
        return { success: false, message: 'Registration failed' };
      }

      localStorage.setItem('accessToken', signupResponse.accessToken);
      localStorage.setItem('authUser', JSON.stringify(signupResponse.authUser));

      setIsAuthenticated(true);
      setUser(signupResponse.authUser);

      window.location.href = '/';
      return { success: true, message: 'Signup successful' };
    } catch (err) {
      const msg = (err as Error).message || 'Signup failed';
      return { success: false, message: msg };
    }
  };

  return { handleSignUp };
};
