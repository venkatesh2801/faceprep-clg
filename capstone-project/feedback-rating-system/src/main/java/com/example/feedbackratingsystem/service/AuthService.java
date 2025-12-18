package com.example.feedbackratingsystem.service;

import com.example.feedbackratingsystem.dto.LoginRequest;
import com.example.feedbackratingsystem.dto.RegisterRequest;

public interface AuthService {
    Object register(RegisterRequest request);
    Object login(LoginRequest request);
}
