package com.notatapp.notatapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notatapp.notatapp.dto.NoteDto;
import com.notatapp.notatapp.mapper.NoteMapper;
import com.notatapp.notatapp.model.Note;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.service.JwtService;
import com.notatapp.notatapp.service.NoteService;
import com.notatapp.notatapp.service.UserService;

import org.springframework.security.oauth2.jwt.Jwt;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/note")
@RequiredArgsConstructor
public class NoteController {

    public final NoteService noteService;
    public final UserService userService;
    public final JwtService jwtService;

    //READ
    @GetMapping("/getAll")
    public List<NoteDto> getAll(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return noteService.getAllNotes(user.getId())
        .stream()
        .map(NoteMapper::toDto)
        .toList();
    }

    @GetMapping("/getById")
    public Note getNoteById(@RequestParam Long noteId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return noteService.getNote(noteId, user.getId());
    }

    @GetMapping("/getNotesInFolder")
    public List<Note> getNotesInFolder(@RequestParam Long folderId, @RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return noteService.getNotesInFolder(user.getId(), folderId);
    }

    @GetMapping("/getRootNotes")
    public List<Note> getRootNotes(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return noteService.getRootNotes(user.getId());
    }


    //UPDATE
    @PostMapping("/update")
    public Note updateNote(@RequestBody UpdateRequest req, @RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        return noteService.updateNote(req.noteId(), user.getId(), req.title(), req.content());
    }


    //CREATE
    @PostMapping("/create")
    public NoteDto create(@RequestBody CreateRequest req, @RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        Note note = noteService.createNote(
            req.title(), 
            req.content(), 
            req.folderId(), 
            userService.getUserFromEmail(jwtService.getEmailFromToken(token)));
        return NoteMapper.toDto(note);
    }


    //DELETE
    @DeleteMapping("/delete")
    public void deleteNote(@RequestParam Long noteId, @RequestHeader("Authorization") String authHeader){
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(jwtService.getEmailFromToken(token));
        noteService.deleteNote(noteId, user.getId());
    }

    public record CreateRequest(String title, String content, Long folderId) {} 
    public record UpdateRequest(Long noteId, String title, String content) {}
}
