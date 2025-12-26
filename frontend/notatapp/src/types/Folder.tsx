
export type Folder = {
    id: number;
    name: string;

    parent: Folder;
    children?: Folder[];

    createdAt?: string;
    updatedAt?: string;
}