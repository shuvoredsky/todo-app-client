import React, { useContext } from "react";
import { Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { AuthContext, type AuthContextType } from "../provider/AuthProvider";
import axios from "axios";

const SignUp: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  if (!authContext) return null;

  const { createUser, setUser, updateUser } = authContext;

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { name, email, password } = values;
      const currentUser = await createUser(email, password);
      const newUser = currentUser.user;

      await updateUser({ displayName: name });
      setUser({ ...newUser, displayName: name });

      const response = await axios.post(
        "https://todo-api-c8fy.onrender.com/users",
        {
          name,
          email,
          password,
        }
      );

      console.log("User saved to backend:", response.data);
      message.success("Registration successful!");
      navigate("/");
      form.resetFields();
    } catch (error: any) {
      console.error("SignUp Error:", error);
      message.error(error.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Register
        </h2>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 5, message: "Name should be at least 5 characters" },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
