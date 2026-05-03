package com.example.TableMate.dto.auth;

public record LoginResponse(
        boolean success,
        String message,
        Long memberId,
        String nickname
) {
    public static LoginResponse success(Long memberId, String nickname) {
        return new LoginResponse(true, "로그인 성공", memberId, nickname);
    }

    public static LoginResponse fail() {
        return new LoginResponse(false, "이메일 또는 비밀번호가 일치하지 않습니다.", null, null);
    }
}
