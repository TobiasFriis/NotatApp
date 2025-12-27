package com.notatapp.notatapp.dto;

public record FolderDto(
    Long id,
    String name,
    Long parentId
) {}
