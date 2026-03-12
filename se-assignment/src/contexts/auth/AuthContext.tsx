import { createContext } from 'react';
import type { AuthContextType } from './auth.interface';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
