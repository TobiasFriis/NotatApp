import React, { useState } from "react";
import type { Note } from "../types/Note";
import type { Folder } from "../types/Folder";
import { NoteService } from "../services/NoteService";
import { FolderService } from "../services/FolderService";

import noteIcon from "../assets/note.png";
import folderIcon from "../assets/folder.png";
import folderOpenIcon from "../assets/open-folder.png";

type FolderTreeProps = {
  parentId: number | null;
  notes: Note[];
  folders: Folder[];
  selectedFolder: number | undefined;
  setSelectedFolder: (folderId: number | undefined) => void;
  fetchNotes: () => void;
  fetchFolders: () => void;
  handleOpenNote: (note: Note) => void;
};

const FolderTree: React.FC<FolderTreeProps> = ({
  parentId,
  notes,
  folders,
  selectedFolder,
  setSelectedFolder,
  fetchNotes,
  fetchFolders,
  handleOpenNote,
}) => {
  const [openFolders, setOpenFolders] = useState<number[]>([]);

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
          return prev.filter((id) => id !== folderId);
        } else {
          return [...prev, folderId];
        }
      });
    }
  };

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
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              const folderId = e.dataTransfer.getData("folderId");
              const folderName = e.dataTransfer.getData("folderName");
              const noteId = e.dataTransfer.getData("noteId");
              if (noteId) {
                await NoteService.update(
                  Number(noteId),
                  undefined,
                  undefined,
                  folder.id,
                );
                fetchNotes();
              }
              if (folderId) {
                try {
                  await FolderService.update(
                    Number(folderId),
                    folderName,
                    folder.id,
                  );
                  fetchFolders();
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
                  openFolders.includes(folder.id) ? folderOpenIcon : folderIcon
                }
              />
              {folder.name}
            </span>
          </li>
          {openFolders.includes(folder.id) && (
            <FolderTree
              parentId={folder.id}
              notes={notes}
              folders={folders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              fetchNotes={fetchNotes}
              fetchFolders={fetchFolders}
              handleOpenNote={handleOpenNote}
            />
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

export default FolderTree;
