import type { Todo } from "../types/Todo";
import { API_URL } from "../services/EnvVarService";

const BASE_URL = `${API_URL}/todos`;

export const TodoService = {
    create: async (title: string): Promise<Todo> => {
        const completed = false;
        const response = await fetch(`${BASE_URL}/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, completed }),
        });

        if (!response.ok) {
            throw new Error("Todo creation failed");
        }

        return response.json();
    },
    update: async (
        id: number,
        title?: string,
        completed?: boolean,
    ): Promise<Todo> => {
        const response = await fetch(`${BASE_URL}/update`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title, completed }),
        });

        if (!response.ok) {
            throw new Error("Todo update failed");
        }
        return response.json();
    },

    getAll: async () => {
        const response = await fetch(`${BASE_URL}/getAllTodos`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching all todos");
        }

        return response.json();
    },
    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Todo deletion failed");
        }

        return;
    },
};
