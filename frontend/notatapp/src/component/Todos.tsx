import { useState } from "react";
import "../styling/Todos.css";

const Todos = () => {
    const [todoText, setTodoText] = useState<string>("");

    return (
        <div className="todo-wrapper">
            <h2>Todos</h2>
            <div>
                <input
                    type="text"
                    placeholder="Add a todo..."
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                />
            </div>
            <div className="todo-container"></div>
        </div>
    );
};

export default Todos;
