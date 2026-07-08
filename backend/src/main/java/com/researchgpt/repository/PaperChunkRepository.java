package com.researchgpt.repository;

import com.researchgpt.entity.Paper;
import com.researchgpt.entity.PaperChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaperChunkRepository extends JpaRepository<PaperChunk, Long> {

    List<PaperChunk> findByPaperOrderByChunkIndexAsc(Paper paper);

    void deleteByPaper(Paper paper);
}