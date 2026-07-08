package com.researchgpt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchgpt.entity.ChunkEmbedding;
import com.researchgpt.entity.PaperChunk;
import com.researchgpt.repository.ChunkEmbeddingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final ChunkEmbeddingRepository chunkEmbeddingRepository;
    private final ObjectMapper objectMapper;

    public EmbeddingService(EmbeddingModel embeddingModel,
                             ChunkEmbeddingRepository chunkEmbeddingRepository) {
        this.embeddingModel = embeddingModel;
        this.chunkEmbeddingRepository = chunkEmbeddingRepository;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generates an embedding (via Ollama / nomic-embed-text) for every chunk
     * in the given list and persists them as ChunkEmbedding rows.
     * <p>
     * Throws a RuntimeException if any chunk fails to embed or serialize,
     * so the caller (PaperService) can mark the paper as FAILED.
     */
    public void generateAndStoreEmbeddings(List<PaperChunk> chunks) {
        List<ChunkEmbedding> embeddingsToSave = new ArrayList<>();

        for (PaperChunk chunk : chunks) {
            try {
                float[] vector = embeddingModel.embed(chunk.getContent());

                if (vector == null || vector.length == 0) {
                    throw new IllegalStateException("Ollama returned an empty embedding for chunk id=" + chunk.getId());
                }

                String embeddingJson = objectMapper.writeValueAsString(vector);

                embeddingsToSave.add(ChunkEmbedding.builder()
                        .paperChunk(chunk)
                        .embedding(embeddingJson)
                        .build());

            } catch (Exception e) {
                log.error("Embedding generation failed for chunk id={}: {}", chunk.getId(), e.getMessage(), e);
                throw new RuntimeException("Embedding generation failed for chunk id=" + chunk.getId(), e);
            }
        }

        chunkEmbeddingRepository.saveAll(embeddingsToSave);
        log.info("Saved {} embeddings for {} chunks", embeddingsToSave.size(), chunks.size());
    }
}