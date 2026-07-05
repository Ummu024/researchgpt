package com.researchgpt.entity;

/**
 * Represents the authorization role of a user.
 * Kept as an enum (not a free-text string) so role checks are compile-time safe.
 */
public enum Role {
    USER,
    ADMIN
}