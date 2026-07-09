package com.researchgpt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetrievedChunkResponse {
    private Long paperId;
    private Long chunkId;
    private Double similarityScore;
    private String chunkText;
}