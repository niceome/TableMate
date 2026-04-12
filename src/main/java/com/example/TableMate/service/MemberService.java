package com.example.tablemate.service;

import com.example.tablemate.dto.member.MemberCreateRequest;
import com.example.tablemate.dto.member.MemberResponse;
import com.example.tablemate.entity.Member;
import com.example.tablemate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Long create(MemberCreateRequest request) {
        Member member = Member.builder()
                .email(request.email())
                .password(request.password())
                .nickname(request.nickname())
                .liking(request.liking())
                .build();

        return memberRepository.save(member).getId();
    }

    public MemberResponse get(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        return MemberResponse.from(member);
    }
}
