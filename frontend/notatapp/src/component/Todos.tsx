import { useEffect, useState } from "react";
import "../styling/Todos.css";
import type { Todo } from "../types/Todo";
import { TodoService } from "../services/TodoService";
import { IoIosCreate } from "react-icons/io";

const Todos = () => {
    const [todoText, setTodoText] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleCreateTodo = async () => {
        const newTodo = await TodoService.create(todoText);
        setTodos([...todos, newTodo]);
        setTodoText("");
    };
    const handleDeleteTodo = async (id: number) => {
        await TodoService.delete(id);
        setTodos(todos.filter((todo) => todo.id !== id));
    };
    const fetchTodos = async () => {
        const response = await TodoService.getAll();
        setTodos(response);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTodos();
    }, []);

    return (
        <div className="todo-wrapper">
            <h2>Todos</h2>
            <div className="todo-create-wrapper">
                <input
                    type="text"
                    placeholder="Add a todo..."
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                />
                <button onClick={handleCreateTodo}>
                    <IoIosCreate />
                </button>
            </div>
            <div className="todo-container">
                <ul>
                    {todos &&
                        todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="todo-item-wrapper"
                                onClick={() => handleDeleteTodo(todo.id)}
                            >
                                {todo.title}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Todos;
