package com.example.feedbackratingsystem.controller;

import com.example.feedbackratingsystem.model.User;
import com.example.feedbackratingsystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all providers (for dropdown in submit feedback)
    @GetMapping("/providers")
    public ResponseEntity<List<UserSummary>> getProviders() {
        List<User> providers = userRepository.findByRoleName("PROVIDER");
        List<UserSummary> summaries = providers.stream()
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    // Get all users (for admin)
    @GetMapping
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserSummary> summaries = users.stream()
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    // Delete user (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Simple DTO for user summary
    public static class UserSummary {
        public Long id;
        public String name;
        public String email;

        public UserSummary(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
    }
}

