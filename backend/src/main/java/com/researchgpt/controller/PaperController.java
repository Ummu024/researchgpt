package com.researchgpt.controller;

import com.researchgpt.dto.PaperResponse;
import com.researchgpt.entity.User;
import com.researchgpt.repository.UserRepository;
import com.researchgpt.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/papers")
@RequiredArgsConstructor
public class PaperController {

    private final PaperService paperService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<PaperResponse> uploadPaper(@RequestParam("file") MultipartFile file,
                                                       Authentication authentication) {
        User owner = resolveUser(authentication);
        PaperResponse response = paperService.uploadPaper(file, owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PaperResponse>> listPapers(Authentication authentication) {
        User owner = resolveUser(authentication);
        return ResponseEntity.ok(paperService.listPapers(owner));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable Long id, Authentication authentication) {
        User owner = resolveUser(authentication);
        paperService.deletePaper(id, owner);
        return ResponseEntity.noContent().build();
    }

    private User resolveUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NoSuchElementException("Authenticated user not found"));
    }
}