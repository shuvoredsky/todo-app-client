import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, DatePicker, Select, Modal } from "antd";
import moment from "moment";
// import { useNavigate } from "react-router";

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
  //   const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      //   const token = localStorage.getItem("token");
      //   if (!token) {
      //     message.error("Please sign in to view todos");
      //     navigate("/signin");
      //     return;
      //   }

      const res = await axios.get("http://localhost:3000/todos", {
        // headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setTodos(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Fetch Todos Error:", err);
      message.error("Error fetching todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/todos/${id}`);
    fetchTodos();
  };

  const handleUpdate = (todo: Todo) => {
    setSelectedTodo(todo);
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? moment(todo.dueDate) : undefined,
      priority: todo.priority,
    });
    setIsModalVisible(true);
  };

  const handleUpdateSubmit = async (values: UpdateTodoFormValues) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      };

      console.log("Update Payload:", payload);

      await axios.put(
        `http://localhost:3000/todos/${selectedTodo?._id}`,
        payload
      );
      message.success("Todo updated successfully");
      setIsModalVisible(false);
      form.resetFields();
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Todos</h2>

      {/* Filters */}
      <div className="flex gap-2 my-2">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="createdAt">Created At</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>

        <select
          value={filters.order}
          onChange={(e) => setFilters({ ...filters, order: e.target.value })}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="border p-2 my-2 flex justify-between">
            <div>
              <p className="font-semibold">{todo.title}</p>
              <p>Status: {todo.status}</p>
              <p>Priority: {todo.priority}</p>
              <p>
                Due:{" "}
                {todo.dueDate ? new Date(todo.dueDate).toDateString() : "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(todo)}
                className="bg-blue-500 text-white px-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleUpdate(todo._id, { status: "done" })}
                className="bg-green-500 text-white px-2 rounded"
              >
                Done
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Update Modal */}
      <Modal
        title="Update Todo"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
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
        <div className="flex gap-2 mt-4">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
