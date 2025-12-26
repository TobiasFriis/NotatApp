import type { Folder } from "./Folder";

export type Note = {
    id: number;
    title: string;
    content: string;
    role?: string;
    folder?: Folder;

    createdAt?: string;
    updatedAt?: string;
}