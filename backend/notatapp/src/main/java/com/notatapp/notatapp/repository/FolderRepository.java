package com.notatapp.notatapp.repository;

import com.notatapp.notatapp.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    Optional<Folder> findByIdAndOwnerId(Long id, Long ownerId);
    List<Folder> findAllByOwnerIdAndParentIsNull(Long ownerId);
    List<Folder> findAllByOwnerIdAndParentId(Long ownerId, Long parentId);
    List<Folder> findAllByOwnerId(Long ownerId);

}