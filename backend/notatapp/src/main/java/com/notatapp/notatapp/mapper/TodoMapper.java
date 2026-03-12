package com.notatapp.notatapp.mapper;

import com.notatapp.notatapp.dto.TodoDto;
import com.notatapp.notatapp.model.Todo;

public class TodoMapper {

    public static TodoDto toDto(Todo todo) {
        return new TodoDto(todo.getId(), todo.getTitle(), todo.isCompleted());
    }
}
