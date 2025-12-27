import React, { useEffect, useState } from 'react'
import "../styling/NotesPage.css";
import { NoteService } from '../services/NoteService';
import { FolderService } from '../services/FolderService';
import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import noteIcon from "../assets/note.png";
import folderIcon from "../assets/folder.png";
import TipTapEditor from '../component/TipTapEditor';

type FolderTreeProps = {
  parentId: number | null;
}

const NotesPage = () => {

  const [folders, setFolders] = useState<Folder[]>([]);
  const [openFolders, setOpenFolders] = useState<Set<number>>(new Set());
  const [inputFolderName, setInputFolderName] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<number>();

  const [notes, setNotes] = useState<Note[]>([]);
  const [openNote, setOpenNote] = useState<Note>();
  const [noteChanged, setNoteChanged] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  
  const [notificationType, setNotificationType] = useState<string>("empty");
  const [notificationText, setNotificationText] = useState<string>("");
  const [notificationExit ,setNotificationExit] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  
  const toggleFolder = (folderId:number) => {
    setSelectedFolder(folderId)
    setOpenFolders(prev => {
      const next = new Set(prev);
      if(next.has(folderId)) {
        next.delete(folderId);
      } else{
        next.add(folderId);
      }
      return next;
    });
  };

  const fetchNotes = async () => {
    try{
      const data = await NoteService.getAll();
      setNotes(data);
    } catch (err){
      setError(true);
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  }
  const fetchFolders = async () => {
    try{
      const data = await FolderService.getAll();
      setFolders(data)
    } catch (err){
      setError(true);
      console.error("Error: ", err);
    } finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchNotes();
    fetchFolders();
  }, [])


  useEffect(() => {
    console.log("useEffect content: ",content)
  }, [content])

  const FolderTree: React.FC<FolderTreeProps> = ({ parentId }) => {
    const childFolders = folders.filter(f => (f.parent?.id === parentId || (!f.parent && parentId === null)) && f.id !== parentId);
    const childNotes = notes.filter(n => n.folder?.id === parentId || (!n.folder && parentId === null));
    console.log("childFolders: ",childFolders)
    console.log("childNotes: ",childNotes);
    if(childFolders.length === 0 && childNotes.length === 0) return null;

    return (
      <ul>
          {childFolders.map(folder => (
              <li key={`folder-${folder.id}`}>
                <span onClick={() => toggleFolder(folder.id)} className='notes-page-note-list-li-div'>
                  <img src={folderIcon} />
                  {folder.name}
                </span>
                {openFolders.has(folder.id) && (
                  <FolderTree parentId={folder.id} />
                )}
              </li>
          ))}
          {childNotes.map(note => (
            <li key={`note-${note.id}`}>
              <span className='notes-page-note-list-li-div' onClick={() => handleOpenNote(note)}>
                <img src={noteIcon} />
                {note.title}
              </span>
            </li>
          ))}
      </ul>
    )
  }


  const handleSaveNote = async () => {
    console.log(noteChanged)
    if(!openNote || !noteChanged)return
    await NoteService.update(openNote.id, title, content)
    await fetchNotes()
    await setNoteChanged(false)
    setNotificationText("Saved note!")
    setNotificationType("save")
    handleNotification()
    console.log("Saved note")
  }

  const handleOpenNote = async (note:Note) => {

    if (openNote && noteChanged){
      await handleSaveNote()
    }
    if(openNote && openNote.id === note.id){
      setOpenNote(undefined);
      setTitle("");
      setContent("");
      return
    }
    setOpenNote(note);
    console.log(note.content)
    await setContent(note.content);
    await setTitle(note.title);
    setNoteChanged(false)
  }

  const handleCreateNote = async () => {
    if(title === "" && content === "")return
    const note = await NoteService.create(title, content, selectedFolder)
    fetchNotes()
    handleOpenNote(note);
    setNotificationText("Created note!")
    setNotificationType("add")
    handleNotification()
  }

  const testGetAll = async () => {
    try{
      var notat = await NoteService.getAll();
      console.log(notat);
    } catch (err){
      console.error("error: ", err);
    }
  }

  const testCreate = async () => {
    
    try{
      var response = await NoteService.create("test", "test content")
      fetchNotes()
      console.log(response);
    } catch (err){
      console.error("error: ", err);
    }
  }

  const testCreateFolder = async () => {
    try{
      var response = await FolderService.create(inputFolderName, selectedFolder);
      fetchFolders()
      console.log(response);
    } catch (err){
      console.error("Error: ", err);
    }

    try{
      var fold = await FolderService.getAll();
      console.log(fold);
    } catch (err){
      console.error("Error: ", err);
    }
    setInputFolderName("");
  }

  const handleNotification = () => {
      setNotificationExit(false);
      setTimeout(() => {
          setNotificationExit(true);

          
          setTimeout(() => {
              setNotificationText("");
              setNotificationType("");
          }, 350);
      }, 3000); 
  }

  useEffect(() => {
    if (!noteChanged) return

    const timeout = setTimeout(async () => {
      if(openNote){
        handleSaveNote()
      }else{
        handleCreateNote()
      }
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [content, title, noteChanged, openNote])
    
  useEffect(() => {
    setNoteChanged(true);
  }, [content, title])

  useEffect(() => {
    console.log("Selected folder: ", selectedFolder)
  }, [selectedFolder])

  if (loading) return "Loading...";
  return (
    <div className='notes-page-wrapper'>
      <div className='notes-page-left-bar-wrapper'>
          <h2>Notes</h2>
          <div className='notes-page-create-folder-wrapper'>
            <input value={inputFolderName} onChange={(e) => setInputFolderName(e.target.value)} placeholder='Folder...' />
            <button onClick={testCreateFolder}>Create folder</button>
          </div>
        <div className='notes-page-note-list'>
          <div>
            {folders.length > 0 || notes.length > 0 ? 
              <FolderTree parentId={null} />
            :
              <div>No notes!</div>
            }
          </div>
        </div>
        <div className='notes-page-todo-list'>
          <h2>Todo</h2>
          <div>
            No todos!
          </div>
        </div>
      </div>
      <TipTapEditor content={content} setContent={setContent} title={title} setTitle={setTitle} />
      <div className={`notes-page-notification-wrapper ${notificationType} ${notificationExit ? "exit" : ""}`}>
          <label>{notificationText}</label>
      </div>
    </div>
  )
}

export default NotesPage
