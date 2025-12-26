package com.notatapp.notatapp.controller;

import com.notatapp.notatapp.model.Folder;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.service.FolderService;
import com.notatapp.notatapp.service.JwtService;
import com.notatapp.notatapp.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;
    private final UserService userService;
    private final JwtService jwtService;

    /* ================= CREATE ================= */

    @PostMapping("/create")
    public Folder createFolder(
            @RequestBody CreateFolderRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.createFolder(
                request.name(),
                request.parentId(),
                user
        );
    }

    /* ================= READ ================= */

    @GetMapping("/getAll")
    public List<Folder> getAll(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.getAll(user);
    }

    // Root folders
    @GetMapping("/getRootFolders")
    public List<Folder> getRootFolders(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.getRootFolders(user);
    }

    // Child folders
    @GetMapping("/{parentId}/children")
    public List<Folder> getChildFolders(
            @PathVariable Long parentId,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.getChildFolders(parentId, user);
    }

    // Single folder
    @GetMapping("/{id}")
    public Folder getFolder(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.getFolder(id, user);
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public Folder renameFolder(
            @PathVariable Long id,
            @RequestBody RenameFolderRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return folderService.renameFolder(id, request.name(), user);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public void deleteFolder(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        folderService.deleteFolder(id, user);
    }

    /* ================= REQUEST DTOs ================= */

    public record CreateFolderRequest(
            String name,
            Long parentId // null = root
    ) {}

    public record RenameFolderRequest(
            String name
    ) {}
}
