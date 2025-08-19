import AddTodo from "../page/AddToDo";
import TodoList from "./TodoList";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div>
          <AddTodo></AddTodo>
        </div>
        <div>
          <TodoList></TodoList>
        </div>
      </div>
    </div>
  );
}
