import React from 'react'

const FolderTree = ({ parentId, folders, notes }) => {
    
    const childFolders = folders.filter(f => f.parent === parentId);
    const childNotes = notes.filter(n => n.folder == parentId);

    if(childFolders === null && childNotes === null) return null;

  return (
    <ul>
        {childFolders.map(folder)}
    </ul>
  )
}

export default FolderTree