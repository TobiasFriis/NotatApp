import type { Note } from "../types/Note";
import { API_URL } from "../services/EnvVarService";

const BASE_URL = `${API_URL}/note`;

export const NoteService = {
  create: async (
    title: string,
    content: string,
    folderId?: number,
  ): Promise<Note> => {
    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, folderId }),
    });

    if (!response.ok) {
      throw new Error("Note creation failed");
    }

    return response.json();
  },
  update: async (
    noteId: number,
    title?: string,
    content?: string,
    folderId?: number,
  ): Promise<Note> => {
    const response = await fetch(`${BASE_URL}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId, title, content, folderId }),
    });

    if (!response.ok) {
      throw new Error("Note update failed");
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${BASE_URL}/getAll`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed fetching all notes");
    }

    return response.json();
  },
  delete: async (noteId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/delete/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Note deletion failed");
    }

    return;
  },
};
