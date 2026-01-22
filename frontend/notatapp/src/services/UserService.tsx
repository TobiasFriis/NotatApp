import type { User } from "../types/User";
import { API_URL } from "../services/EnvVarService";

const BASE_URL = `${API_URL}/auth`;
export const UserService = {
  register: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  // Login bruker
  login: async (
    email: string,
    password: string,
  ): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },
};
