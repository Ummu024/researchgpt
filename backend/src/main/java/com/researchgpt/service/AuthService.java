package com.researchgpt.service;

import com.researchgpt.dto.AuthResponse;
import com.researchgpt.dto.LoginRequest;
import com.researchgpt.dto.RegisterRequest;
import com.researchgpt.entity.Role;
import com.researchgpt.entity.User;
import com.researchgpt.exception.UserAlreadyExistsException;
import com.researchgpt.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Business logic for registration and login.
 *
 * This class is deliberately "thin on HTTP, thick on orchestration" — it has
 * no knowledge of HttpServletRequest/Response. That keeps it reusable
 * (e.g. testable without spinning up a servlet container) and keeps
 * AuthController focused purely on translating HTTP <-> DTOs.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(
                    "An account with email " + request.email() + " already exists");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        User savedUser = userService.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Delegates credential checking to Spring Security's AuthenticationManager,
        // which uses the AuthenticationProvider configured in ApplicationConfig
        // (DaoAuthenticationProvider -> UserService + PasswordEncoder under the hood).
        // Throws BadCredentialsException automatically on mismatch.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userService.getByEmail(request.email());
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}