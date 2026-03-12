package com.notatapp.notatapp.controller;

import com.notatapp.notatapp.dto.TodoDto;
import com.notatapp.notatapp.mapper.TodoMapper;
import com.notatapp.notatapp.model.Todo;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.service.JwtService;
import com.notatapp.notatapp.service.TodoService;
import com.notatapp.notatapp.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;
    private final JwtService jwtService;

    /* ================= CREATE ================= */

    @PostMapping("/create")
    public TodoDto createTodo(
        @RequestBody CreateTodoRequest request,
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(
            jwtService.getEmailFromToken(token)
        );
        Todo todo = todoService.createTodo(
            request.title(),
            request.completed(),
            user
        );
        return TodoMapper.toDto(todo);
    }

    /* ================= READ ================= */

    @GetMapping("/getAllTodos")
    public List<TodoDto> getAllTodos(
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(
            jwtService.getEmailFromToken(token)
        );
        return todoService
            .getAllTodos(user)
            .stream()
            .map(TodoMapper::toDto)
            .toList();
    }

    // Single todo
    @GetMapping("/{id}")
    public Todo getTodo(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(
            jwtService.getEmailFromToken(token)
        );
        return todoService.getTodo(id, user);
    }

    /* ================= UPDATE ================= */
    @PostMapping("/update")
    public TodoDto updateTodo(
        @RequestBody UpdateTodoRequest request,
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(
            jwtService.getEmailFromToken(token)
        );
        TodoDto dto = TodoMapper.toDto(
            todoService.updateTodo(
                request.id(),
                request.title(),
                request.completed(),
                user
            )
        );
        return dto;
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/delete/{id}")
    public void deleteTodo(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        User user = userService.getUserFromEmail(
            jwtService.getEmailFromToken(token)
        );
        todoService.deleteTodo(id, user);
    }

    /* ================= REQUEST DTOs ================= */

    public record CreateTodoRequest(String title, boolean completed) {}

    public record UpdateTodoRequest(Long id, String title, boolean completed) {}
}
