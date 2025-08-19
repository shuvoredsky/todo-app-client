import React from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import type moment from "moment";

interface AddTodoFormValues {
  title: string;
  description?: string;
  dueDate?: moment.Moment;
}

const AddTodo: React.FC = () => {
  const [form] = Form.useForm<AddTodoFormValues>();

  const onFinish = async (values: AddTodoFormValues) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      };

      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Todo added successfully!");
        form.resetFields();
      } else {
        message.error(data.message || "Failed to add todo");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error connecting to server");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form fields!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Todo</h2>
      <Form
        form={form}
        layout="vertical"
        name="add-todo"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the todo title" }]}
        >
          <Input placeholder="Enter todo title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Enter todo description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: false }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Todo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTodo;
