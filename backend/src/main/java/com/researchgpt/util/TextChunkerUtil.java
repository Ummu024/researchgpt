package com.researchgpt.util;

import java.util.ArrayList;
import java.util.List;

public class TextChunkerUtil {

    private static final int CHUNK_SIZE = 1000;
    private static final int CHUNK_OVERLAP = 180;

    private TextChunkerUtil() {
        // utility class
    }

    public static List<String> chunkText(String text) {
        List<String> chunks = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return chunks;
        }

        String normalizedText = text.trim();
        int textLength = normalizedText.length();
        int start = 0;

        while (start < textLength) {
            int end = Math.min(start + CHUNK_SIZE, textLength);
            String chunk = normalizedText.substring(start, end).trim();

            if (!chunk.isEmpty()) {
                chunks.add(chunk);
            }

            if (end == textLength) {
                break;
            }

            start = end - CHUNK_OVERLAP;
            if (start < 0) {
                start = 0;
            }
        }

        return chunks;
    }
}