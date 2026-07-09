package com.researchgpt.exception;

public class EmbeddingsMissingException extends RuntimeException {
    public EmbeddingsMissingException(String message) {
        super(message)
        ;
    }
}