package com.example.TableMate.dto.auth;

public record LoginRequest(
        String email,
        String password
) {
}
