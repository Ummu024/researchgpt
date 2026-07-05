package com.researchgpt.controller;

import com.researchgpt.dto.AuthResponse;
import com.researchgpt.dto.LoginRequest;
import com.researchgpt.dto.RegisterRequest;
import com.researchgpt.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Exposes the two public authentication endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * Deliberately thin: validation is declarative (@Valid), and all business
 * logic lives in AuthService. This controller's only job is HTTP <-> DTO.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}