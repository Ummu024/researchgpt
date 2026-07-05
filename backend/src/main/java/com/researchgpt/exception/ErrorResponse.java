package com.researchgpt.exception;

import java.time.Instant;
import java.util.Map;

/**
 * Standard shape for every error response returned by the API.
 * `details` is optional — used for field-level validation errors.
 */
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        Map<String, String> details
) {
    public ErrorResponse(int status, String error, String message) {
        this(Instant.now(), status, error, message, null);
    }

    public ErrorResponse(int status, String error, String message, Map<String, String> details) {
        this(Instant.now(), status, error, message, details);
    }
}