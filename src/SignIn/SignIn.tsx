import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [form] = Form.useForm<SignInFormValues>();
  const navigate = useNavigate();

  const onFinish = async (values: SignInFormValues) => {
    try {
      console.log("Form Values:", values);

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Sign In Successful!");
        form.resetFields();
        navigate("/");
      } else {
        message.error(data.message || "Sign In Failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error connecting to server!");
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
