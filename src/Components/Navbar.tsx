import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Space } from "antd";
import {
  UnorderedListOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const data = await res.json();
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { key: "1", label: "Home", icon: <HomeOutlined /> },
    { key: "2", label: "Tasks", icon: <UnorderedListOutlined /> },
  ];
  console.log(user);

  return (
    <Layout>
      <Header className="flex justify-between items-center px-4 bg-blue-600">
        {/* বাম পাশে logo বা menu */}
        <div className="text-white text-lg font-bold">Todo App</div>

        {/* মাঝখানে Menu */}
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          className="flex-1 bg-blue-600"
          style={{ justifyContent: "center", backgroundColor: "transparent" }}
        />

        {/* ডান পাশে User Info + Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Space>
              <UserOutlined style={{ color: "white" }} />
              <span className="text-white font-medium">{user.name}</span>
            </Space>
          ) : (
            <span className="text-gray-300">Loading...</span>
          )}
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            danger
            onClick={() => console.log("Demo Logout Clicked")}
          >
            Logout
          </Button>
        </div>
      </Header>
    </Layout>
  );
};

export default Navbar;
