package com.researchgpt.repository;

import com.researchgpt.entity.ChunkEmbedding;
import com.researchgpt.entity.PaperChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChunkEmbeddingRepository extends JpaRepository<ChunkEmbedding, Long> {

    Optional<ChunkEmbedding> findByPaperChunk(PaperChunk paperChunk);

    void deleteByPaperChunk(PaperChunk paperChunk);

    /**
     * Loads all embeddings with their PaperChunk and Paper eagerly fetched,
     * avoiding N+1 lazy-loading queries when RetrievalService iterates over
     * every embedding to compute similarity in Java.
     */
    @Query("SELECT ce FROM ChunkEmbedding ce " +
           "JOIN FETCH ce.paperChunk pc " +
           "JOIN FETCH pc.paper p")
    List<ChunkEmbedding> findAllWithChunkAndPaper();
}