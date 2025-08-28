import React from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import useAxiosSecure from "../Components/hook/useAxiosSecure";

interface AddTodoProps {
  onAddSuccess?: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await axiosSecure.post("/todos", {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      });
      message.success("Todo added successfully");
      form.resetFields();
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (err) {
      console.error("Add Todo Error:", err);
      message.error("Error adding todo");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please enter a title" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: "Please select a priority" }]}
      >
        <Select>
          <Select.Option value="low">Low</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="high">High</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="dueDate" label="Due Date">
        <DatePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Todo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTodo;
