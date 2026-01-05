import type { Folder } from "../types/Folder";

const BASE_URL = "http://localhost:8080/folders"

export const FolderService = {
    create: async (name:string, parentId?: number): Promise<Folder> => {
        console.log(parentId)
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

    },
    update: async (folderId: number, name: string, parentId?: number): Promise<Folder> => {
        console.log(folderId, name, parentId)
        const response = await fetch(`${BASE_URL}/update`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderId, name, parentId }),
        });

        if (!response.ok){
            throw new Error("Folder update failed");
        }

        return response.json();
    },
    delete: async (folderId: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/delete/${folderId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok){
            throw new Error("Folder deletion failed");
        }
        return;
    }
};
