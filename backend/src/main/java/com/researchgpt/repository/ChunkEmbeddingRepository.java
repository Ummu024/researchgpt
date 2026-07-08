package com.researchgpt.repository;

import com.researchgpt.entity.ChunkEmbedding;
import com.researchgpt.entity.PaperChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChunkEmbeddingRepository extends JpaRepository<ChunkEmbedding, Long> {

    Optional<ChunkEmbedding> findByPaperChunk(PaperChunk paperChunk);

    void deleteByPaperChunk(PaperChunk paperChunk);
}