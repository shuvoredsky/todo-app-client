import React, { useContext, useState } from "react";
import { Form, Input, Button, message, DatePicker, Select, Modal } from "antd";
import moment from "moment";
import { AuthContext } from "../provider/AuthProvider";
import type { AuthContextType } from "../provider/AuthProvider";
import useAxiosSecure from "../Components/hook/useAxiosSecure";

const { Option } = Select;

interface AddTodoFormValues {
  title: string;
  description?: string;
  dueDate?: moment.Moment;
  priority: "low" | "medium" | "high";
  userEmail: string; // Add userEmail to the form values interface
}

const AddTodo: React.FC = () => {
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const user = authContext?.user;
  const userEmail = user?.email;
  const [form] = Form.useForm<AddTodoFormValues>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const axiosSecure = useAxiosSecure();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: AddTodoFormValues) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        userEmail: userEmail,
      };

      const response = await axiosSecure.post("/todos", payload);

      const data = response.data;
      console.log("Response:", data);

      if (data.success) {
        message.success("Todo added successfully!");
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(data.message || "Failed to add todo");
      }
    } catch (error) {
      console.error("Axios Error:", error);
      message.error("Error connecting to server");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Form Failed:", errorInfo);
    message.error("Please check the form fields!");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Button type="primary" onClick={showModal}>
        Add Task
      </Button>
      <Modal
        title="Add Todo"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="add-todo"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ userEmail: userEmail }} // Set initial value for userEmail
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the todo title" }]}
          >
            <Input placeholder="Enter todo title" />
          </Form.Item>

          <Form.Item label="Your Email" name="userEmail">
            <Input readOnly value={userEmail} placeholder="Your email" />
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

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select a priority" }]}
            initialValue="medium"
          >
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Todo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddTodo;
