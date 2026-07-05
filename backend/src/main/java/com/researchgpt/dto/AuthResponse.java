package com.researchgpt.dto;

/**
 * Output payload returned by both register and login endpoints.
 * Contains the JWT the client should attach as:
 *   Authorization: Bearer <token>
 * on subsequent requests.
 */
public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        String role
) {
    public AuthResponse(String token, Long userId, String fullName, String email, String role) {
        this(token, "Bearer", userId, fullName, email, role);
    }
}