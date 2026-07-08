package com.researchgpt.service;

import com.researchgpt.dto.PaperResponse;
import com.researchgpt.entity.Paper;
import com.researchgpt.entity.ProcessingStatus;
import com.researchgpt.entity.User;
import com.researchgpt.exception.FileStorageException;
import com.researchgpt.exception.InvalidFileException;
import com.researchgpt.exception.PaperNotFoundException;
import com.researchgpt.repository.PaperRepository;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PaperService {

    private static final long MAX_FILE_SIZE = 25L * 1024 * 1024; // 25MB
    private static final String CONTENT_TYPE_PDF = "application/pdf";

    private final PaperRepository paperRepository;
    private final Path uploadDir;

    public PaperService(PaperRepository paperRepository,
                         @Value("${app.upload.dir:uploads}") String uploadDirPath) {
        this.paperRepository = paperRepository;
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
     * Extracts text from the stored PDF using Apache PDFBox and updates the
     * paper's processingStatus accordingly (PENDING -> PROCESSING -> COMPLETED/FAILED).
     * Runs synchronously as part of the upload request for Phase 5 Batch 1.
     */
    private void extractTextAndUpdateStatus(Paper paper, Path filePath) {
        paper.setProcessingStatus(ProcessingStatus.PROCESSING);
        paperRepository.save(paper);

        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            paper.setExtractedText(text);
            paper.setProcessingStatus(ProcessingStatus.COMPLETED);
            log.info("Text extraction completed for paper id={}, characters={}",
                    paper.getId(), text != null ? text.length() : 0);
        } catch (IOException e) {
            paper.setProcessingStatus(ProcessingStatus.FAILED);
            log.error("Text extraction failed for paper id={}: {}", paper.getId(), e.getMessage());
        }

        paperRepository.save(paper);
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