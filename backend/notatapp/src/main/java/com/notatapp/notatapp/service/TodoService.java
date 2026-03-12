package com.notatapp.notatapp.service;

import com.notatapp.notatapp.model.Todo;
import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.repository.TodoRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepo;

    /* ================= CREATE ================= */

    public Todo createTodo(String title, boolean completed, User user) {
        Todo todo = Todo.builder()
            .title(title)
            .completed(completed)
            .owner(user)
            .build();

        return todoRepo.save(todo);
    }

    /* ================= READ ================= */

    public List<Todo> getAllTodos(User user) {
        return todoRepo.findAllByOwnerId(user.getId());
    }

    public Todo getTodo(Long todoId, User user) {
        return todoRepo
            .findByIdAndOwnerId(todoId, user.getId())
            .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    /* ================= UPDATE ================= */
    @Transactional
    public Todo updateTodo(
        Long id,
        String title,
        boolean completed,
        User user
    ) {
        Todo existingTodo = getTodo(id, user);
        existingTodo.setTitle(title);
        existingTodo.setCompleted(completed);
        return todoRepo.save(existingTodo);
    }

    /* ================= DELETE ================= */

    @Transactional
    public void deleteTodo(Long todoId, User user) {
        Todo todo = getTodo(todoId, user);
        todoRepo.delete(todo);
    }
}
