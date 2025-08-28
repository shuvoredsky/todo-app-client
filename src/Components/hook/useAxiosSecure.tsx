import axios from "axios";
import type { AxiosInstance } from "axios";
import { useContext, useEffect } from "react";
import { AuthContext, type AuthContextType } from "../../provider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-init";

const axiosSecure: AxiosInstance = axios.create({
  baseURL: "https://todo-api-c8fy.onrender.com",
});

const useAxiosSecure = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const user = authContext?.user;

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = user?.accessToken;
        console.log("Adding token to request:", !!token); // Debug
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          console.log("401 Unauthorized: Logging out user");
          try {
            await signOut(auth);
            if (authContext?.setUser) {
              authContext.setUser(null);
            }
            window.location.href = "/sign-in";
          } catch (signOutError) {
            console.error("Sign out error:", signOutError);
          }
        }
        console.error("Response Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, authContext]);

  return axiosSecure;
};

export default useAxiosSecure;
