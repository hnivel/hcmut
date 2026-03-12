// validators/auth.ts
import { z } from 'zod';

export const SignupSchema = z
  .object({
    firstName: z.string().nonempty({ message: 'First name is required' }),
    lastName: z.string().nonempty({ message: 'Last name is required' }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default SignupSchema;
