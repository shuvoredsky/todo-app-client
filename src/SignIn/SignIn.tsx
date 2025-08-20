import React, { useContext, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import type { AuthContextType } from "../provider/AuthProvider";
import { toast } from "react-toastify";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const signIn = authContext?.signIn;
  const [form] = Form.useForm<SignInFormValues>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: SignInFormValues) => {
    if (!signIn) return;

    try {
      await signIn(values.email, values.password);
      toast.success("User Login Successful!");
      form.resetFields();
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login Failed!");
      toast.error(err.message || "Login Failed!");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form fields!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <Form
        form={form}
        layout="vertical"
        name="signin"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
