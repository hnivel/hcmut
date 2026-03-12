export interface LoginResponse {
  accessToken: string;
  authUser: {
    userId: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}

export interface SignupResponse {
  accessToken: string;
  authUser: {
    userId: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}
