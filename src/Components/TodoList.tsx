import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Select,
  Modal,
  List,
  Card,
  Spin,
  Alert,
  Pagination,
} from "antd";
import moment from "moment";
import { AuthContext, type AuthContextType } from "../provider/AuthProvider";
import useAxiosSecure from "./hook/useAxiosSecure";

const { Option } = Select;

interface Todo {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "done";
  userId: string;
}

interface UpdateTodoFormValues {
  title: string;
  description?: string;
  dueDate?: moment.Moment;
  priority: "low" | "medium" | "high";
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosSecure = useAxiosSecure();
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 5,
  });
  const [pagination, setPagination] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [form] = Form.useForm<UpdateTodoFormValues>();
  const authContext = useContext<AuthContextType | null>(AuthContext);
  const user = authContext?.user;
  const userEmail = user?.email;

  const fetchTodos = async () => {
    if (!userEmail) {
      setError("Please sign in to view todos");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosSecure.get("/todos/me", {
        params: { ...filters, userEmail },
      });

      setTodos(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch Todos Error:", err);
      setError("Error fetching todos");
      message.error("Error fetching todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters, userEmail]);

  const handleDelete = async (id: string) => {
    try {
      await axiosSecure.delete(`/todos/${id}`);
      message.success("Todo deleted successfully");
      fetchTodos();
    } catch (err) {
      console.error("Delete Todo Error:", err);
      message.error("Error deleting todo");
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? moment(todo.dueDate) : undefined,
      priority: todo.priority,
    });
  };

  const handleUpdateSubmit = async (values: UpdateTodoFormValues) => {
    if (!selectedTodo?._id) {
      message.error("Invalid Todo ID");
      return;
    }

    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      };
      await axiosSecure.put(`/todos/${selectedTodo._id}`, payload);
      message.success("Todo updated successfully");
      setIsModalVisible(false);
      form.resetFields();
      setSelectedTodo(null);
      fetchTodos();
    } catch (err: any) {
      console.error("Update Todo Error:", err.response?.data);
      message.error(err.response?.data?.message || "Error updating todo");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedTodo(null);
  };

  const handlePaginationChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-100">
        <Spin size="large" tip="Loading your todos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-100">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-gray-100 min-h-[400px]">
      {/* Filters */}
      <Form
        layout="vertical"
        className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Form.Item label="Status">
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            allowClear
          >
            <Option value="">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="done">Done</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Priority">
          <Select
            value={filters.priority}
            onChange={(value) => setFilters({ ...filters, priority: value })}
            allowClear
          >
            <Option value="">All Priority</Option>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Start Date">
          <DatePicker
            className="w-full"
            onChange={(date) =>
              setFilters({
                ...filters,
                startDate: date ? date.format("YYYY-MM-DD") : "",
              })
            }
          />
        </Form.Item>

        <Form.Item label="End Date">
          <DatePicker
            className="w-full"
            onChange={(date) =>
              setFilters({
                ...filters,
                endDate: date ? date.format("YYYY-MM-DD") : "",
              })
            }
          />
        </Form.Item>

        <Form.Item label="Sort By">
          <Select
            value={filters.sortBy}
            onChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <Option value="createdAt">Created At</Option>
            <Option value="priority">Priority</Option>
            <Option value="dueDate">Due Date</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Order">
          <Select
            value={filters.order}
            onChange={(value) => setFilters({ ...filters, order: value })}
          >
            <Option value="desc">Descending</Option>
            <Option value="asc">Ascending</Option>
          </Select>
        </Form.Item>
      </Form>

      {/* Todo List */}
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item>
            <Card
              title={todo.title}
              className="shadow-md"
              actions={[
                <Button
                  type="link"
                  onClick={() => handleUpdateClick(todo)}
                  className="text-blue-500"
                >
                  Update
                </Button>,
                <Button
                  type="link"
                  onClick={() => handleUpdate(todo._id, { status: "done" })}
                  className="text-green-500"
                >
                  Done
                </Button>,
                <Button
                  type="link"
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-500"
                >
                  Delete
                </Button>,
              ]}
            >
              <p>
                <strong>Status:</strong> {todo.status}
              </p>
              <p>
                <strong>Priority:</strong> {todo.priority}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {todo.dueDate ? new Date(todo.dueDate).toDateString() : "N/A"}
              </p>
              {todo.description && (
                <p>
                  <strong>Description:</strong> {todo.description}
                </p>
              )}
            </Card>
          </List.Item>
        )}
      />

      {/* Update Modal */}
      <Modal
        title="Update Todo"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="max-w-md mx-auto"
      >
        <Form
          form={form}
          layout="vertical"
          name="update-todo"
          onFinish={handleUpdateSubmit}
          onFinishFailed={(errorInfo) => {
            console.log("Form Failed:", errorInfo);
            message.error("Please check the form fields!");
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the todo title" }]}
          >
            <Input placeholder="Enter todo title" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter todo description" rows={4} />
          </Form.Item>

          <Form.Item label="Due Date" name="dueDate">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select a priority" }]}
          >
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Todo
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={pagination.page}
            total={pagination.totalItems}
            pageSize={pagination.limit}
            onChange={handlePaginationChange}
            showSizeChanger={false}
            responsive
          />
        </div>
      )}
    </div>
  );
};

export default TodoList;
