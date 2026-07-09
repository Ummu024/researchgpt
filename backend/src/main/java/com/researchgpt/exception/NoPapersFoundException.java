package com.researchgpt.exception;

public class NoPapersFoundException extends RuntimeException {
    public NoPapersFoundException(String message) {
        super(message);
    }
}