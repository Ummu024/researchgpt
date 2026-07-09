package com.researchgpt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchgpt.dto.RetrievedChunkResponse;
import com.researchgpt.entity.ChunkEmbedding;
import com.researchgpt.entity.PaperChunk;
import com.researchgpt.exception.EmbeddingsMissingException;
import com.researchgpt.exception.NoPapersFoundException;
import com.researchgpt.repository.ChunkEmbeddingRepository;
import com.researchgpt.repository.PaperRepository;
import com.researchgpt.util.CosineSimilarityUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RetrievalService {

    private static final int TOP_K = 5;

    private final PaperRepository paperRepository;
    private final ChunkEmbeddingRepository chunkEmbeddingRepository;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;

    public RetrievalService(PaperRepository paperRepository,
                             ChunkEmbeddingRepository chunkEmbeddingRepository,
                             EmbeddingService embeddingService) {
        this.paperRepository = paperRepository;
        this.chunkEmbeddingRepository = chunkEmbeddingRepository;
        this.embeddingService = embeddingService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Retrieves the top-K most semantically similar chunks to the given
     * question, using cosine similarity computed entirely in Java
     * (no pgvector / native vector database).
     */
    public List<RetrievedChunkResponse> retrieveTopChunks(String question) {
        if (paperRepository.count() == 0) {
            throw new NoPapersFoundException("No papers have been uploaded yet. Upload a paper before searching.");
        }

        List<ChunkEmbedding> allEmbeddings = chunkEmbeddingRepository.findAllWithChunkAndPaper();
        if (allEmbeddings.isEmpty()) {
            throw new EmbeddingsMissingException(
                    "No embeddings are available yet. Papers may still be processing or failed to process.");
        }

        float[] queryVector = embeddingService.embedText(question);

        List<RetrievedChunkResponse> scoredChunks = new ArrayList<>();

        for (ChunkEmbedding chunkEmbedding : allEmbeddings) {
            try {
                float[] chunkVector = objectMapper.readValue(chunkEmbedding.getEmbedding(), float[].class);
                double similarity = CosineSimilarityUtil.cosineSimilarity(queryVector, chunkVector);

                PaperChunk chunk = chunkEmbedding.getPaperChunk();

                scoredChunks.add(RetrievedChunkResponse.builder()
                        .paperId(chunk.getPaper().getId())
                        .chunkId(chunk.getId())
                        .similarityScore(roundScore(similarity))
                        .chunkText(chunk.getContent())
                        .build());

            } catch (Exception e) {
                log.warn("Skipping unparsable embedding id={}: {}", chunkEmbedding.getId(), e.getMessage());
            }
        }

        if (scoredChunks.isEmpty()) {
            throw new EmbeddingsMissingException("Stored embeddings could not be read. Please contact support.");
        }

        return scoredChunks.stream()
                .sorted(Comparator.comparingDouble(RetrievedChunkResponse::getSimilarityScore).reversed())
                .limit(TOP_K)
                .collect(Collectors.toList());
    }

    private double roundScore(double value) {
        return Math.round(value * 10000.0) / 10000.0;
    }
}