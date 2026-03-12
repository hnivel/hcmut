export type UserRole = 'mentee' | 'mentor' | 'faculty';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  supportAreas?: string[];
}
