package com.notatapp.notatapp.controller;

import com.notatapp.notatapp.model.User;
import com.notatapp.notatapp.service.UserService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest req) {
        return userService.registerUser(req.email(), req.password());
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req){
        return Collections.singletonMap("token",userService.loginUser(req.email(), req.password()));
    }

    @GetMapping("/test")
    public String testMethod() {
        return "Hello";
    }
    

    public record RegisterRequest(String email, String password) {}
    public record LoginRequest(String email, String password) {}
    public record UserResponse(Long id, String email, String role, LocalDateTime createdAt) {}
}
