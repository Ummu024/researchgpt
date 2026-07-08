package com.researchgpt.service;


import com.researchgpt.dto.PaperResponse;
import com.researchgpt.entity.Paper;
import com.researchgpt.entity.PaperChunk;
import com.researchgpt.entity.ProcessingStatus;
import com.researchgpt.entity.User;
import com.researchgpt.exception.FileStorageException;
import com.researchgpt.exception.InvalidFileException;
import com.researchgpt.exception.PaperNotFoundException;
import com.researchgpt.repository.ChunkEmbeddingRepository;
import com.researchgpt.repository.PaperChunkRepository;
import com.researchgpt.repository.PaperRepository;
import com.researchgpt.util.TextChunkerUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PaperService {

    private static final long MAX_FILE_SIZE = 25L * 1024 * 1024; // 25MB
    private static final String CONTENT_TYPE_PDF = "application/pdf";

    private final PaperRepository paperRepository;
    private final PaperChunkRepository paperChunkRepository;
    private final ChunkEmbeddingRepository chunkEmbeddingRepository;
    private final EmbeddingService embeddingService;
    private final Path uploadDir;

    public PaperService(PaperRepository paperRepository,
                         PaperChunkRepository paperChunkRepository,
                         ChunkEmbeddingRepository chunkEmbeddingRepository,
                         EmbeddingService embeddingService,
                         @Value("${app.upload.dir:uploads}") String uploadDirPath) {
        this.paperRepository = paperRepository;
        this.paperChunkRepository = paperChunkRepository;
        this.chunkEmbeddingRepository = chunkEmbeddingRepository;
        this.embeddingService = embeddingService;
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directory: " + uploadDirPath, e);
        }
    }

    public PaperResponse uploadPaper(MultipartFile file, User owner) {
        validateFile(file);

        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String storedFilename = UUID.randomUUID() + ".pdf";

        Path targetPath = uploadDir.resolve(storedFilename).normalize();
        if (!targetPath.getParent().equals(uploadDir)) {
            throw new InvalidFileException("Invalid file path");
        }

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file " + originalFilename, e);
        }

        Paper paper = Paper.builder()
                .filename(storedFilename)
                .originalFilename(originalFilename)
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .uploadDate(LocalDateTime.now())
                .processingStatus(ProcessingStatus.PENDING)
                .owner(owner)
                .build();

        Paper saved = paperRepository.save(paper);
        log.info("Paper uploaded: id={}, owner={}", saved.getId(), owner.getEmail());

        extractTextAndUpdateStatus(saved, targetPath);

        return toResponse(saved);
    }

    /**
     * Extracts text from the stored PDF using Apache PDFBox, then chunks the
     * extracted text and generates embeddings for each chunk via Ollama.
     * <p>
     * Status flow: PENDING -> PROCESSING -> COMPLETED (only after embeddings
     * are successfully stored) or FAILED (if extraction, chunking, or
     * embedding generation fails at any point).
     */
    private void extractTextAndUpdateStatus(Paper paper, Path filePath) {
        paper.setProcessingStatus(ProcessingStatus.PROCESSING);
        paperRepository.save(paper);

        String extractedText;
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            extractedText = stripper.getText(document);

            paper.setExtractedText(extractedText);
            paperRepository.save(paper);
            log.info("Text extraction completed for paper id={}, characters={}",
                    paper.getId(), extractedText != null ? extractedText.length() : 0);
        } catch (IOException e) {
            paper.setProcessingStatus(ProcessingStatus.FAILED);
            paperRepository.save(paper);
            log.error("Text extraction failed for paper id={}: {}", paper.getId(), e.getMessage());
            return;
        }

        // Phase 5 Batch 2: chunk the extracted text
        List<PaperChunk> chunks = generateAndSaveChunks(paper);
        if (chunks == null) {
            // generateAndSaveChunks already set status to FAILED and saved
            return;
        }

        // Phase 5 Batch 3: generate + store embeddings for each chunk
        generateAndSaveEmbeddings(paper, chunks);
    }

    /**
     * Phase 5 Batch 2: splits paper.extractedText into overlapping chunks
     * and persists them as PaperChunk rows.
     *
     * @return the saved chunks, or {@code null} if chunking failed
     *         (in which case the paper's status is already set to FAILED and saved)
     */
    private List<PaperChunk> generateAndSaveChunks(Paper paper) {
        try {
            List<String> chunkContents = TextChunkerUtil.chunkText(paper.getExtractedText());

            if (chunkContents.isEmpty()) {
                log.warn("No chunks generated for paper id={}, no extracted text available", paper.getId());
                paper.setProcessingStatus(ProcessingStatus.FAILED);
                paperRepository.save(paper);
                return null;
            }

            List<PaperChunk> chunks = new ArrayList<>();
            for (int i = 0; i < chunkContents.size(); i++) {
                chunks.add(PaperChunk.builder()
                        .paper(paper)
                        .chunkIndex(i)
                        .content(chunkContents.get(i))
                        .build());
            }

            List<PaperChunk> savedChunks = paperChunkRepository.saveAll(chunks);
            log.info("Saved {} chunks for paper id={}", savedChunks.size(), paper.getId());
            return savedChunks;

        } catch (Exception e) {
            log.error("Chunk generation failed for paper id={}: {}", paper.getId(), e.getMessage(), e);
            paper.setProcessingStatus(ProcessingStatus.FAILED);
            paperRepository.save(paper);
            return null;
        }
    }

    /**
     * Phase 5 Batch 3: generates an embedding (Ollama / nomic-embed-text) for
     * each chunk and stores it. Only marks the paper COMPLETED if every
     * embedding is generated and saved successfully; otherwise marks FAILED.
     */
    private void generateAndSaveEmbeddings(Paper paper, List<PaperChunk> chunks) {
        try {
            embeddingService.generateAndStoreEmbeddings(chunks);
            paper.setProcessingStatus(ProcessingStatus.COMPLETED);
            paperRepository.save(paper);
            log.info("Embeddings completed for paper id={}, chunkCount={}", paper.getId(), chunks.size());
        } catch (Exception e) {
            log.error("Embedding generation failed for paper id={}: {}", paper.getId(), e.getMessage(), e);
            paper.setProcessingStatus(ProcessingStatus.FAILED);
            paperRepository.save(paper);
        }
    }

    public List<PaperResponse> listPapers(User owner) {
        return paperRepository.findByOwnerOrderByUploadDateDesc(owner)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deletePaper(Long paperId, User owner) {
        Paper paper = paperRepository.findByIdAndOwner(paperId, owner)
                .orElseThrow(() -> new PaperNotFoundException("Paper not found with id: " + paperId));

        Path filePath = uploadDir.resolve(paper.getFilename()).normalize();
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file for paper id: " + paperId, e);
        }

        List<PaperChunk> chunks = paperChunkRepository.findByPaperOrderByChunkIndexAsc(paper);
        for (PaperChunk chunk : chunks) {
            chunkEmbeddingRepository.deleteByPaperChunk(chunk);
        }
        paperChunkRepository.deleteByPaper(paper);
        paperRepository.delete(paper);
        log.info("Paper deleted: id={}, owner={}", paperId, owner.getEmail());
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File must not be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File exceeds maximum allowed size of 25MB");
        }
        if (!CONTENT_TYPE_PDF.equals(file.getContentType())) {
            throw new InvalidFileException("Only PDF files are allowed");
        }
        String original = file.getOriginalFilename();
        if (original == null || !original.toLowerCase().endsWith(".pdf")) {
            throw new InvalidFileException("Only PDF files are allowed");
        }
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "unnamed.pdf";
        }
        return Paths.get(filename).getFileName().toString();
    }

    private PaperResponse toResponse(Paper paper) {
        return PaperResponse.builder()
                .id(paper.getId())
                .originalFilename(paper.getOriginalFilename())
                .fileSize(paper.getFileSize())
                .mimeType(paper.getMimeType())
                .uploadDate(paper.getUploadDate())
                .processingStatus(paper.getProcessingStatus())
                .build();
    }
}