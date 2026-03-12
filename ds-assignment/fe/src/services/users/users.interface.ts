export type UserRole = 'customer' | 'driver' | 'restaurant_owner' | 'admin';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}
