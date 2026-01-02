package com.notatapp.notatapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.notatapp.notatapp.model.Folder;
import com.notatapp.notatapp.model.Note;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.repository.FolderRepository;
import com.notatapp.notatapp.repository.NoteRepository;
import com.notatapp.notatapp.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    
    /* CREATE */
    public Note createNote(String title, String content, Long folderId, User user) {
        Folder folder = null;

        if (folderId != null) {
            folder = folderRepository.findByIdAndOwnerId(folderId, user.getId())
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
        }

        Note note = Note.builder()
                .title(title)
                .content(content)
                .folder(folder)
                .owner(user)
                .build();

        return noteRepository.save(note);
    }

    /* READ */
    public Note getNote(Long noteId, Long userId) {
        return noteRepository.findByIdAndOwnerId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public List<Note> getAllNotes(Long userId) {
        return noteRepository.findAllByOwnerId(userId);
    }

    public List<Note> getNotesInFolder(Long userId, Long folderId) {
        return noteRepository.findAllByOwnerIdAndFolderId(userId, folderId);
    }

    public List<Note> getRootNotes(Long userId) {
        return noteRepository.findAllByOwnerIdAndFolderIsNull(userId);
    }

    /* UPDATE */
    @Transactional
    public Note updateNote(Long noteId, Long userId, String title, String content, Long folderId) {
        Note note = getNote(noteId, userId);

        if (title != null) note.setTitle(title);
        if (content != null) note.setContent(content);
        if (folderId != null) {
            Folder folder = folderRepository.findByIdAndOwnerId(folderId, userId)
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
            note.setFolder(folder);
        }
        return note;
    }

    /* DELETE */
    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = getNote(noteId, userId);
        noteRepository.delete(note);
    }
}
