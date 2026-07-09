package com.researchgpt.util;

public class CosineSimilarityUtil {

    private CosineSimilarityUtil() {
        // utility class
    }

    /**
     * Computes cosine similarity between two vectors: dot(a,b) / (||a|| * ||b||).
     * Result range is [-1, 1], where 1 means identical direction (most similar).
     */
    public static double cosineSimilarity(float[] a, float[] b) {
        if (a == null || b == null) {
            throw new IllegalArgumentException("Vectors must not be null");
        }
        if (a.length != b.length) {
            throw new IllegalArgumentException("Vectors must have the same dimension: " + a.length + " vs " + b.length);
        }
        if (a.length == 0) {
            throw new IllegalArgumentException("Vectors must not be empty");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * L2-normalizes a vector to unit length. Not required for cosine similarity
     * itself (the formula above already normalizes), but provided for reuse if
     * a future batch needs pre-normalized vectors (e.g. for dot-product-only
     * comparisons).
     */
    public static float[] normalize(float[] vector) {
        if (vector == null || vector.length == 0) {
            throw new IllegalArgumentException("Vector must not be null or empty");
        }

        double norm = 0.0;
        for (float v : vector) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);

        if (norm == 0.0) {
            return vector;
        }

        float[] normalized = new float[vector.length];
        for (int i = 0; i < vector.length; i++) {
            normalized[i] = (float) (vector[i] / norm);
        }
        return normalized;
    }
}