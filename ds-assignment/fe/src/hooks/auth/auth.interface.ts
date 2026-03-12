export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: 'customer' | 'driver' | 'restaurant_owner';
  phone?: string;
  recommendedCustomerId?: string;
}
