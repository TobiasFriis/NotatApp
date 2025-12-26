package com.notatapp.notatapp.service;

import com.notatapp.notatapp.model.Folder;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.repository.FolderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepo;

    /* ================= CREATE ================= */

    public Folder createFolder(String name, Long parentId, User user) {
        Folder parent = null;

        if (parentId != null) {
            parent = folderRepo.findByIdAndOwnerId(parentId, user.getId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
        }

        Folder folder = Folder.builder()
                .name(name)
                .parent(parent)
                .owner(user)
                .build();

        return folderRepo.save(folder);
    }

    /* ================= READ ================= */

    public List<Folder> getAll(User user){
        return folderRepo.findAllByOwnerId(user.getId());
    }

    public List<Folder> getRootFolders(User user) {
        return folderRepo.findAllByOwnerIdAndParentIsNull(user.getId());
    }

    public List<Folder> getChildFolders(Long parentId, User user) {
        return folderRepo.findAllByOwnerIdAndParentId(user.getId(), parentId);
    }

    public Folder getFolder(Long folderId, User user) {
        return folderRepo.findByIdAndOwnerId(folderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Folder not found"));
    }

    public List<Folder> getAllFolders(User user) {
        return folderRepo.findAllByOwnerId(user.getId());
    }

    /* ================= UPDATE ================= */

    public Folder renameFolder(Long folderId, String newName, User user) {
        Folder folder = getFolder(folderId, user);
        folder.setName(newName);
        return folderRepo.save(folder);
    }

    /* ================= DELETE ================= */

    @Transactional
    public void deleteFolder(Long folderId, User user) {
        Folder folder = getFolder(folderId, user);
        folderRepo.delete(folder);
        // ON DELETE CASCADE tar seg av subfolders + notes
    }
}
