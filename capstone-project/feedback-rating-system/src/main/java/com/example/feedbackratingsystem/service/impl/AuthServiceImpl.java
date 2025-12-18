package com.example.feedbackratingsystem.service.impl;

import com.example.feedbackratingsystem.dto.LoginRequest;
import com.example.feedbackratingsystem.dto.RegisterRequest;
import com.example.feedbackratingsystem.model.Role;
import com.example.feedbackratingsystem.model.User;
import com.example.feedbackratingsystem.repository.RoleRepository;
import com.example.feedbackratingsystem.repository.UserRepository;
import com.example.feedbackratingsystem.security.JwtUtil;
import com.example.feedbackratingsystem.service.AuthService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Object register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Invalid role: " + request.getRole()));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of(role));

        userRepository.save(user);

        // JWT
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getEmail(), roles);

        return new AuthResponse(user, token);
    }

    @Override
    public Object login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getEmail(), roles);

        return new AuthResponse(user, token);
    }

    public static class AuthResponse {
        public String token;
        public Long id;
        public String name;
        public String email;
        public List<String> roles;

        public AuthResponse(User user, String token) {
            this.token = token;
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());
        }
    }
}
