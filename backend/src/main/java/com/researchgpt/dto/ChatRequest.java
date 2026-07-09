package com.researchgpt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for POST /api/chat
 *
 * Example:
 * {
 *   "question": "What is virtual reality?"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotBlank(message = "Question must not be empty")
    private String question;
}