package com.example.TableMate.dto.Member;

import com.example.TableMate.domain.Liking;
import com.example.TableMate.domain.Member;

public record MemberResponse(
        Long id,
        String email,
        String nickname,
        Liking liking
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
