import AddTodo from "../page/AddToDo";
import TodoList from "./TodoList";

export default function Home() {
  return (
    <div>
      <AddTodo></AddTodo>
      <TodoList></TodoList>
    </div>
  );
}
