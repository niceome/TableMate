package com.example.tablemate.dto.member;

import com.example.tablemate.entity.Member;

public record MemberResponse(
        Long id,
        String email,
        String nickname,
        String liking
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getLiking()
        );
    }
}
