import type { ReactNode } from "react";
import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext, AuthContextType } from "../provider/AuthProvider";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authContext = useContext<AuthContextType | null>(AuthContext);

  if (!authContext) {
    return <Navigate to="/sign-in" />;
  }

  const { user, loading } = authContext;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (user && user.email) {
    return <>{children}</>;
  }

  return <Navigate to="/sign-in" />;
};

export default PrivateRoute;
