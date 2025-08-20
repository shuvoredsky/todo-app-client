import React, { useContext } from "react";
import { Layout, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext, type AuthContextType } from "../provider/AuthProvider";

import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const navigate = useNavigate();

  const user = authContext?.user;
  const logOut = authContext?.logOut;

  const handleLogOut = () => {
    if (!logOut) return;
    logOut()
      .then(() => {
        toast.success("Sign out successfully");
        navigate("/sign-in");
      })
      .catch((error: any) => toast.error(error.message));
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <Layout>
      <Header className="flex justify-between items-center px-4 bg-blue-600">
        <div className="text-white text-lg font-bold">Todo App</div>

        <div className="flex items-center space-x-4">
          {user ? (
            <Space>
              <UserOutlined style={{ color: "white" }} />
              <span className="text-white font-medium">
                {user?.displayName || "User"}
              </span>
              <Button
                type="text"
                className="text-white font-bold hover:text-red-300"
                onClick={handleLogOut}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                type="default"
                className="text-blue-600 font-bold border-blue-600 hover:bg-blue-100"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Space>
          )}
        </div>
      </Header>
    </Layout>
  );
};

export default Navbar;
