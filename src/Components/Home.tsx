import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import AddTodo from "../page/AddToDo";
import AllTodoList from "./AllTodoList";
import TodoList from "./TodoList";
import { AuthContext, type AuthContextType } from "../provider/AuthProvider";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

const Home: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const userEmail = authContext?.user?.email;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userEmail) {
        message.error("Please sign in to view content");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user with email:", userEmail); // Debug
        const res = await axios.get("http://localhost:3000/users", {
          params: { email: userEmail },
        });
        console.log("Fetch User Response:", res.data); // Debug
        if (res.data.success && res.data.data.length > 0) {
          setUser(res.data.data[0]);
        } else {
          message.error("User not found");
          setUser(null);
        }
      } catch (err) {
        console.error("Fetch User Error:", err);
        message.error("Error fetching user data");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userEmail]);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-6">Please sign in to continue</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <p className="text-gray-600 mb-4">Your role: {user.role}</p>
      {user.role === "user" ? (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          <div className="w-full md:w-1/2">
            <AddTodo />
          </div>
          <div className="w-full md:w-1/2">
            <TodoList />
          </div>
        </div>
      ) : user.role === "admin" ? (
        <div>
          <AllTodoList />
        </div>
      ) : (
        <div className="text-center p-6">Invalid user role</div>
      )}
    </div>
  );
};

export default Home;
