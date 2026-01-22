import React, { useEffect, useState } from "react";
import "../styling/NotesPage.css";
import { NoteService } from "../services/NoteService";
import { FolderService } from "../services/FolderService";
import type { Folder } from "../types/Folder";
import type { Note } from "../types/Note";
import noteIcon from "../assets/note.png";
import folderIcon from "../assets/folder.png";
import folderOpenIcon from "../assets/open-folder.png";
import TipTapEditor from "../component/TipTapEditor";
import { useNavigate } from "react-router-dom";

type FolderTreeProps = {
  parentId: number | null;
};

const NotesPage = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [openFolders, setOpenFolders] = useState<number[]>([]);
  const [inputFolderName, setInputFolderName] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<number>();

  const [notes, setNotes] = useState<Note[]>([]);
  const [openNote, setOpenNote] = useState<Note>();
  const [noteChanged, setNoteChanged] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

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
      const now = Math.floor(Date.now() / 1000); // sekunder
      return payload.exp < now;
    } catch {
      return true; // ugyldig token
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleFolder = (folderId: number) => {
    if (selectedFolder === undefined && openFolders.includes(folderId)) {
      setSelectedFolder(folderId);
    } else {
      if (selectedFolder === folderId && openFolders.includes(folderId)) {
        setSelectedFolder(undefined);
      } else {
        setSelectedFolder(folderId);
      }
      setOpenFolders((prev) => {
        if (prev.includes(folderId)) {
          // fjern
          return prev.filter((id) => id !== folderId);
        } else {
          // legg til
          return [...prev, folderId];
        }
      });
    }
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

  const FolderTree: React.FC<FolderTreeProps> = ({ parentId }) => {
    const childFolders = folders.filter((f) => f.parentId === parentId);
    const childNotes = notes.filter((n) => n.folderId === parentId);
    if (childFolders.length === 0 && childNotes.length === 0) return null;

    return (
      <ul className="notes-page-note-list-ul">
        {childFolders.map((folder) => (
          <div>
            <li
              key={`folder-${folder.id}`}
              className={`notes-page-note-list-folder ${selectedFolder === folder.id ? "selected" : ""}`}
              onClick={() => toggleFolder(folder.id)}
              onDragOver={(e) => e.preventDefault()} // Må ha for å tillate drop
              onDrop={async (e) => {
                e.preventDefault();
                const folderId = e.dataTransfer.getData("folderId");
                const folderName = e.dataTransfer.getData("folderName");
                const noteId = e.dataTransfer.getData("noteId");
                if (noteId) {
                  // Oppdater note med ny folderId
                  await NoteService.update(
                    Number(noteId),
                    undefined,
                    undefined,
                    folder.id,
                  );
                  fetchNotes(); // oppdater frontend
                }
                if (folderId) {
                  // Oppdater folder med ny parentId
                  try {
                    await FolderService.update(
                      Number(folderId),
                      folderName,
                      folder.id,
                    );
                    fetchFolders(); // oppdater frontend
                  } catch (err) {
                    console.error("Error: ", err);
                  }
                }
              }}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("folderId", folder.id.toString());
                e.dataTransfer.setData("folderName", folder.name);
              }}
            >
              <span className="notes-page-note-list-li-div">
                <img
                  src={
                    openFolders.includes(folder.id)
                      ? folderOpenIcon
                      : folderIcon
                  }
                />
                {folder.name}
              </span>
            </li>
            {openFolders.includes(folder.id) && (
              <FolderTree parentId={folder.id} />
            )}
          </div>
        ))}
        {childNotes.map((note) => (
          <li
            key={`note-${note.id}`}
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("noteId", note.id.toString());
            }}
          >
            <span
              className="notes-page-note-list-li-div"
              onClick={() => handleOpenNote(note)}
            >
              <img src={noteIcon} />
              {note.title}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const handleSaveNote = async () => {
    if (!openNote || !noteChanged) return;
    await NoteService.update(openNote.id, title, content);
    await fetchNotes();
    await setNoteChanged(false);
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
      <div className="notes-page-left-bar-wrapper">
        <div className="notes-page-create-folder-wrapper">
          <input
            value={inputFolderName}
            onChange={(e) => setInputFolderName(e.target.value)}
            placeholder="Folder..."
          />
          <button onClick={createFolder}>Create folder</button>
          {selectedFolder !== undefined && (
            <button onClick={() => setSelectedFolder(undefined)}>
              Unselect folder
            </button>
          )}
          {selectedFolder !== undefined && (
            <button onClick={handleDeleteFolder}>Delete folder</button>
          )}
        </div>
        <div className="notes-page-note-list">
          <div>
            {folders.length > 0 || notes.length > 0 ? (
              <FolderTree parentId={null} />
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
