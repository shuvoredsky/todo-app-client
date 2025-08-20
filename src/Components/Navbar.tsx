import React, { useContext } from "react";
import { Layout, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../provider/AuthProvider";
import type { AuthContextType } from "../provider/AuthProvider";
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
      .then(() => toast.success("Sign out successfully"))
      .catch((error: any) => toast.error(error.message));
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
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogOut}
                className="block  text-left text-error"
              >
                Logout
              </button>
            </Space>
          ) : (
            <span className="text-gray-300">No User</span>
          )}
        </div>
      </Header>
    </Layout>
  );
};

export default Navbar;
