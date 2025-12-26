import React, { useEffect, useState } from 'react'
import "../styling/NotesPage.css";
import { NoteService } from '../services/NoteService';
import { FolderService } from '../services/FolderService';
import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';

type FolderTreeProps = {
  parentId: number | null;
}

const NotesPage = () => {

  const [folders, setFolders] = useState<Folder[]>([]);
  const [openFolders, setOpenFolders] = useState<Set<number>>(new Set());
  const [inputFolderName, setInputFolderName] = useState<string>("");

  const [notes, setNotes] = useState<Note[]>([]);
  

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  
  const toggleFolder = (folderId:number) => {
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
      setNotes(data)
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
                <div onClick={() => toggleFolder(folder.id)}>
                  {folder.name}
                </div>
                {openFolders.has(folder.id) && (
                  <FolderTree parentId={folder.id} />
                )}
              </li>
          ))}
          {childNotes.map(note => (
            <li key={`note-${note.id}`}>
              {note.title}
            </li>
          ))}
      </ul>
    )
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
      var response = await FolderService.create(inputFolderName);
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
  }

  if (loading) return "Loading...";
  return (
    <div className='notes-page-wrapper'>
      <div className='notes-page-left-bar-wrapper'>
        <div className='notes-page-note-list'>
          <h2>Notes</h2>
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
      <div className='notes-page-text-area-wrapper'>
        <div className='notes-page-text-area-content'>
          <button onClick={testCreate}>
            Create
          </button>
          <button onClick={testGetAll}>Get all</button>
          <input value={inputFolderName} onChange={(e) => setInputFolderName(e.target.value)}  />
          <button onClick={testCreateFolder}>Create folder</button>
        </div>
      </div>
    </div>
  )
}

export default NotesPage
