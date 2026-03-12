// validators/auth.ts
import { z } from 'zod';

export const SignupSchema = z
  .object({
    name: z.string().nonempty({ message: 'Full name is required' }),
    email: z
      .string()
      .nonempty({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Confirm password is required' }),
    role: z.enum(['customer', 'driver', 'restaurant_owner'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
    phone: z.string().optional(),
    recommendedCustomerId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default SignupSchema;
