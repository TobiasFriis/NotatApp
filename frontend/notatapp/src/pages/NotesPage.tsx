import { useEffect, useState } from "react";
import "../styling/NotesPage.css";
import { NoteService } from "../services/NoteService";
import { FolderService } from "../services/FolderService";
import type { Folder } from "../types/Folder";
import type { Note } from "../types/Note";

import DeleteFolderModal from "../component/DeleteFolderModal";
import FolderTree from "../component/FolderTree";
import TipTapEditor from "../component/TipTapEditor";
import { useNavigate } from "react-router-dom";

const NotesPage = () => {
    const navigate = useNavigate();

    const [folders, setFolders] = useState<Folder[]>([]);
    const [inputFolderName, setInputFolderName] = useState<string>("");
    const [selectedFolder, setSelectedFolder] = useState<number>();

    const [notes, setNotes] = useState<Note[]>([]);
    const [openNote, setOpenNote] = useState<Note>();
    const [noteChanged, setNoteChanged] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [notificationType, setNotificationType] = useState<string>("empty");
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationExit, setNotificationExit] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const isTokenExpired = (): boolean => {
        const token = localStorage.getItem("token");
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now;
        } catch {
            return true;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const fetchNotes = async () => {
        try {
            const data = await NoteService.getAll();
            setNotes(data);
        } catch (err) {
            setError(true);
            console.error("Error: ", error);
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };
    const fetchFolders = async () => {
        try {
            const data = await FolderService.getAll();
            setFolders(data);
        } catch (err) {
            setError(true);
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isTokenExpired()) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }
        fetchNotes();
        fetchFolders();
    }, []);

    const handleSaveNote = async () => {
        if (!openNote || !noteChanged) return;
        await NoteService.update(openNote.id, title, content);
        await fetchNotes();
        setNoteChanged(false);
        setNotificationText("Saved note!");
        setNotificationType("save");
        handleNotification();
    };

    const handleOpenNote = async (note: Note) => {
        if (openNote && noteChanged) {
            await handleSaveNote();
        }
        if (openNote && openNote.id === note.id) {
            setOpenNote(undefined);
            setTitle("");
            setContent("");
            return;
        }
        setOpenNote(note);
        await setContent(note.content);
        await setTitle(note.title);
        setNoteChanged(false);
    };

    const handleCreateNote = async () => {
        if (title === "" && content === "") return;
        const note = await NoteService.create(title, content, selectedFolder);
        fetchNotes();
        handleOpenNote(note);
        setNotificationText("Created note!");
        setNotificationType("add");
        handleNotification();
    };

    const handleUnselectNote = () => {
        setOpenNote(undefined);
        setTitle("");
        setContent("");
    };

    const handleDeleteNote = async () => {
        if (!openNote) return;
        await NoteService.delete(openNote.id);
        fetchNotes();
        handleUnselectNote();
        setNotificationText("Deleted note!");
        setNotificationType("delete");
        handleNotification();
    };

    const handleDeleteFolder = async () => {
        if (selectedFolder === undefined) return;
        await FolderService.delete(selectedFolder);
        fetchFolders();
        setSelectedFolder(undefined);
        setNotificationText("Deleted folder!");
        setNotificationType("delete");
        handleNotification();
    };

    const createFolder = async () => {
        try {
            await FolderService.create(inputFolderName, selectedFolder);
            fetchFolders();
        } catch (err) {
            console.error("Error: ", err);
        }

        try {
            await FolderService.getAll();
        } catch (err) {
            console.error("Error: ", err);
        }
        setInputFolderName("");
    };

    const handleNotification = () => {
        setNotificationExit(false);
        setTimeout(() => {
            setNotificationExit(true);

            setTimeout(() => {
                setNotificationText("");
                setNotificationType("");
            }, 350);
        }, 3000);
    };

    useEffect(() => {
        if (!noteChanged) return;

        const timeout = setTimeout(async () => {
            if (openNote) {
                handleSaveNote();
            } else {
                if (title !== "" && content !== "") {
                    handleCreateNote();
                }
            }
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [content, title, noteChanged, openNote]);

    useEffect(() => {
        setNoteChanged(true);
    }, [content, title]);

    if (loading) return "Loading...";
    return (
        <div className="notes-page-wrapper">
            {modalOpen && (
                <DeleteFolderModal
                    modalOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    handleDeleteFolder={handleDeleteFolder}
                />
            )}
            <div className="notes-page-left-bar-wrapper">
                <div className="notes-page-create-folder-wrapper">
                    <input
                        value={inputFolderName}
                        onChange={(e) => setInputFolderName(e.target.value)}
                        placeholder="Folder..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                createFolder();
                            }
                        }}
                    />
                    <button onClick={createFolder}>Create folder</button>
                    {selectedFolder !== undefined && (
                        <button onClick={() => setSelectedFolder(undefined)}>
                            Unselect folder
                        </button>
                    )}
                    {selectedFolder !== undefined && (
                        <button onClick={() => setModalOpen(true)}>
                            Delete folder
                        </button>
                    )}
                </div>
                <div className="notes-page-note-list">
                    <div>
                        {folders.length > 0 || notes.length > 0 ? (
                            <FolderTree
                                parentId={null}
                                notes={notes}
                                folders={folders}
                                selectedFolder={selectedFolder}
                                setSelectedFolder={setSelectedFolder}
                                fetchNotes={fetchNotes}
                                fetchFolders={fetchFolders}
                                handleOpenNote={handleOpenNote}
                            />
                        ) : (
                            <div>No notes!</div>
                        )}
                    </div>
                </div>
                <div className="notes-page-todo-list">
                    <h2>Todo</h2>
                    <div>No todos!</div>
                </div>
                <button onClick={logout} className="notes-page-logout-button">
                    Logout
                </button>
            </div>
            <TipTapEditor
                content={content}
                setContent={setContent}
                title={title}
                setTitle={setTitle}
                setOpenNote={setOpenNote}
                openNote={openNote}
                setNoteChanged={setNoteChanged}
                handleDeleteNote={handleDeleteNote}
                handleSaveNote={handleSaveNote}
            />
            <div
                className={`notes-page-notification-wrapper ${notificationType} ${notificationExit ? "exit" : ""}`}
            >
                <label>{notificationText}</label>
            </div>
        </div>
    );
};

export default NotesPage;
