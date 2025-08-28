import { createContext, useEffect, type ReactNode, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
  type UserProfile,
} from "firebase/auth";
import app from "../firebase/firebase-init";

export type AuthContextType = {
  user: { email: string | null; accessToken: string | null } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{
      email: string | null;
      accessToken: string | null;
    } | null>
  >;
  createUser: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  updateUser: (updateData: UserProfile) => Promise<void>;
  logOut: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const auth = getAuth(app);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{
    email: string | null;
    accessToken: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updateData: UserProfile) => {
    if (!auth.currentUser) return Promise.reject("No user logged in");
    return updateProfile(auth.currentUser, updateData);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth).then(() => {
      setUser(null);
      console.log("User logged out"); // Debug
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: FirebaseUser | null) => {
        if (currentUser) {
          try {
            const accessToken = await currentUser.getIdToken();
            setUser({
              email: currentUser.email,
              accessToken,
            });
          } catch (error) {
            console.error("Error getting access token:", error);
            setUser(null);
          }
        } else {
          setUser(null);
          console.log("No user authenticated"); // Debug
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        createUser,
        signIn,
        updateUser,
        logOut,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
