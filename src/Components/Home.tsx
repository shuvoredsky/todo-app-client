import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { message, Spin, Alert, Card, Modal, Button } from "antd";
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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userEmail) {
        message.error("Please sign in to view content");
        setLoading(false);
        return;
      }

      try {
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spin size="large" tip="Loading your todos..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Alert
          message="Authentication Required"
          description="Please sign in to access your todos."
          type="warning"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
        Welcome, {user.name || "User"}!
      </h1>
      {user.role === "user" ? (
        <div className="grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <Card
              title="Your Todos"
              className="shadow-lg"
              headStyle={{ background: "#1890ff", color: "white" }}
            >
              <TodoList />
            </Card>
            <Button
              type="primary"
              className="w-full lg:w-auto"
              onClick={showAddModal}
            >
              Add Task
            </Button>
          </div>
        </div>
      ) : user.role === "admin" ? (
        <Card
          title="All Todos"
          className="shadow-lg"
          headStyle={{ background: "#1890ff", color: "white" }}
        >
          <AllTodoList />
        </Card>
      ) : (
        <Alert
          message="Invalid Role"
          description="Your user role is invalid. Please contact support."
          type="error"
          showIcon
          className="max-w-md mx-auto"
        />
      )}

      {/* Add Todo Modal */}
      <Modal
        title="Add New Task"
        open={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
        className="max-w-md mx-auto"
      >
        <AddTodo onAddSuccess={handleAddModalCancel} />
      </Modal>
    </div>
  );
};

export default Home;
