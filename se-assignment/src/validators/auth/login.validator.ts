import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),

  password: z
    .string({ required_error: 'Password is required' })
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default LoginSchema;
