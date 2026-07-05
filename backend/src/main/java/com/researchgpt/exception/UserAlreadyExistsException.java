package com.researchgpt.exception;

/**
 * Thrown when a registration attempt uses an email that's already taken.
 * Mapped to HTTP 409 Conflict by GlobalExceptionHandler.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}