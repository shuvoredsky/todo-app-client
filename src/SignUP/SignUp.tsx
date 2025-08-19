import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [form] = Form.useForm<SignUpFormValues>();
  const navigate = useNavigate();

  const onFinish = (values: SignUpFormValues) => {
    console.log("Form Values:", values);

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));

    message.success("Sign Up Successful!");
    navigate("/");
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form fields!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <Form
        form={form}
        layout="vertical"
        name="signup"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
