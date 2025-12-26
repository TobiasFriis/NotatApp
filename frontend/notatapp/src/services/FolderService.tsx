import type { Folder } from "../types/Folder";

const BASE_URL = "http://localhost:8083/folders"

export const FolderService = {
    create: async (name:string, parentId?: number): Promise<Folder> => {
        const response = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentId }),
        });
        
        if (!response.ok){
            throw new Error("Folder creation failed");
        }

        return response.json();
    },

    getAll: async () => {
        const response = await fetch(`${BASE_URL}/getAll`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok){
            throw new Error("Failed fetching all folders")
        }

        return response.json();

    }
}
