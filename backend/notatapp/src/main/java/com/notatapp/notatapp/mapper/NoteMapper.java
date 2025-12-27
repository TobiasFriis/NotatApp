package com.notatapp.notatapp.mapper;

import com.notatapp.notatapp.dto.NoteDto;
import com.notatapp.notatapp.model.Note;


public class NoteMapper {
    public static NoteDto toDto(Note note){
        return new NoteDto(
            note.getId(),
            note.getTitle(),
            note.getContent(),
            note.getFolder() != null ? note.getFolder().getId() : null
        );
    }
    
}
