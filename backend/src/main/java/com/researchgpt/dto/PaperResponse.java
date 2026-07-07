package com.researchgpt.dto;

import com.researchgpt.entity.ProcessingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PaperResponse {
    private Long id;
    private String originalFilename;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime uploadDate;
    private ProcessingStatus processingStatus;
}