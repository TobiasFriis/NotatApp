package com.notatapp.notatapp.repository;

import com.notatapp.notatapp.model.Todo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Optional<Todo> findByIdAndOwnerId(Long id, Long ownerId);
    List<Todo> findAllByOwnerId(Long ownerId);
}
