import React, { useEffect, useState } from "react";
import { Button, Select, message } from "antd";
import moment from "moment";
import useAxiosSecure from "./hook/useAxiosSecure";

const { Option } = Select;

interface Todo {
  _id: string;
  title: string;
  userEmail: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "done";
  description?: string;
  dueDate?: string;
  createdAt: string;
}

const AllTodoList: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState<any>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      console.log("Fetching Todos with Params:", filters); // Debug
      const res = await axiosSecure.get("/todos", {
        params: filters,
      });
      console.log("Fetch Todos Response:", res.data); // Debug
      setTodos(res.data.data);
      setPagination(res.data.pagination);
    } catch (err: any) {
      console.error("Fetch Todos Error:", err);
      message.error(err.response?.data?.message || "Error fetching todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Todos</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          placeholder="Filter by Status"
          className="w-40"
        >
          <Option value="">All Status</Option>
          <Option value="pending">Pending</Option>
          <Option value="done">Done</Option>
        </Select>

        <Select
          value={filters.priority}
          onChange={(value) => setFilters({ ...filters, priority: value })}
          placeholder="Filter by Priority"
          className="w-40"
        >
          <Option value="">All Priority</Option>
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
        </Select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="border rounded px-2 py-1"
        />

        <Select
          value={filters.sortBy}
          onChange={(value) => setFilters({ ...filters, sortBy: value })}
          placeholder="Sort By"
          className="w-40"
        >
          <Option value="createdAt">Created At</Option>
          <Option value="priority">Priority</Option>
          <Option value="dueDate">Due Date</Option>
        </Select>

        <Select
          value={filters.order}
          onChange={(value) => setFilters({ ...filters, order: value })}
          placeholder="Order"
          className="w-40"
        >
          <Option value="desc">Descending</Option>
          <Option value="asc">Ascending</Option>
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center p-6">Loading...</div>
      ) : todos.length === 0 ? (
        <div className="text-center p-6">No todos found</div>
      ) : (
        <>
          {/* Todo List */}
          <div className="grid gap-4">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className="border rounded-lg p-4 bg-white shadow-md"
              >
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-600">User: {todo.userEmail}</p>
                <p className="text-gray-600">Priority: {todo.priority}</p>
                <p className="text-gray-600">Status: {todo.status}</p>
                <p className="text-gray-500 text-sm">
                  Created: {moment(todo.createdAt).format("YYYY-MM-DD HH:mm")}
                </p>
                {todo.dueDate && (
                  <p className="text-gray-500 text-sm">
                    Due: {moment(todo.dueDate).format("YYYY-MM-DD")}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
              >
                Previous
              </Button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                disabled={filters.page >= pagination.totalPages}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTodoList;
