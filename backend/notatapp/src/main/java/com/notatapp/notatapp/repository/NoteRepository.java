package com.notatapp.notatapp.repository;

import com.notatapp.notatapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByIdAndOwnerId(Long id, Long ownerId);
    List<Note> findAllByOwnerId(Long ownerId);
    List<Note> findAllByOwnerIdAndFolderId(Long ownerId, Long folderId);
    List<Note> findAllByOwnerIdAndFolderIsNull(Long ownerId);
}