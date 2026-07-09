package com.researchgpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response payload for POST /api/chat
 *
 * Example:
 * {
 *   "answer": "Virtual reality is ...",
 *   "sources": [ { "paperId": 1, "chunkId": 12, "similarityScore": 0.83, "chunkText": "..." } ]
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private String answer;

    private List<RetrievedChunkResponse> sources;
}