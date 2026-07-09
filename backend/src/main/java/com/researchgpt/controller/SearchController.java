package com.researchgpt.controller;

import com.researchgpt.dto.RetrievedChunkResponse;
import com.researchgpt.dto.SearchRequest;
import com.researchgpt.service.RetrievalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final RetrievalService retrievalService;

    public SearchController(RetrievalService retrievalService) {
        this.retrievalService = retrievalService;
    }

    @PostMapping
    public ResponseEntity<List<RetrievedChunkResponse>> search(@Valid @RequestBody SearchRequest request) {
        List<RetrievedChunkResponse> results = retrievalService.retrieveTopChunks(request.getQuestion());
        return ResponseEntity.ok(results);
    }
}