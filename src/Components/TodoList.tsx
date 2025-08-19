import React, { useEffect, useState } from "react";
import axios from "axios";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<any[]>([]);
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

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos", {
        params: filters,
      });
      setTodos(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/todos/${id}`);
    fetchTodos();
  };

  const handleUpdate = async (id: string, updates: any) => {
    await axios.put(`http://localhost:3000/todos/${id}`, updates);
    fetchTodos();
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
