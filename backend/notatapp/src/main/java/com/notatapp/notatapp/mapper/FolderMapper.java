package com.notatapp.notatapp.mapper;

import com.notatapp.notatapp.dto.FolderDto;
import com.notatapp.notatapp.model.Folder;

public class FolderMapper {
    public static FolderDto toDto(Folder folder){
        return new FolderDto(
            folder.getId(),
            folder.getName(),
            folder.getParent() != null ? folder.getParent().getId() : null
        );
    }   
}
