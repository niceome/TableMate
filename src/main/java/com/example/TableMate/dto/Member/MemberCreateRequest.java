package com.example.TableMate.dto.Member;

public record MemberCreateRequest(
        String email,
        String password,
        String nickname,
        String liking
) {}
