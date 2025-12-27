import type { Folder } from "./Folder";

export type Note = {
    id: number;
    title: string;
    content: string;
    role?: string;
    folderId?: number;

    createdAt?: string;
    updatedAt?: string;
}