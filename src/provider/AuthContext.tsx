import { createContext } from "react";
import type { User, UserProfile } from "firebase/auth";

// Context type define
export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  createUser: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  updateUser: (updateData: UserProfile) => Promise<void>;
  logOut: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Default context
export const AuthContext = createContext<AuthContextType | null>(null);
