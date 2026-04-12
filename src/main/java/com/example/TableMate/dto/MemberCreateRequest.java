package com.example.tablemate.dto.member;

public record MemberCreateRequest(
        String email,
        String password,
        String nickname,
        String liking
) {}
