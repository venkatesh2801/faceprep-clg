package com.example.feedbackratingsystem.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;  // ROLE_USER or ROLE_PROVIDER or ROLE_ADMIN
}
