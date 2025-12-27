package com.notatapp.notatapp.dto;

public record NoteDto(
    Long id,
    String title,
    String content,
    Long folderId
) {}
