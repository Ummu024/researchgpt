package com.researchgpt.service;

import com.researchgpt.dto.RetrievedChunkResponse;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Builds the final prompt sent to the Ollama chat model,
 * combining retrieved context chunks with the user's question.
 */
@Component
public class PromptBuilder {

    public String buildPrompt(String question, List<RetrievedChunkResponse> chunks) {
        StringBuilder contextBuilder = new StringBuilder();

        for (RetrievedChunkResponse chunk : chunks) {
            contextBuilder.append("- ")
                    .append(chunk.getChunkText())
                    .append("\n");
        }

        return """
                You are a helpful research assistant.
                Answer ONLY using the provided context.
                If the answer cannot be found, clearly say so.

                Context:
                %s
                Question:
                %s

                Answer:
                """.formatted(contextBuilder.toString(), question);
    }
}