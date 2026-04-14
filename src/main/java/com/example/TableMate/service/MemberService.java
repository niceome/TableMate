package com.example.TableMate.service;

import com.example.TableMate.domain.Liking;
import com.example.TableMate.domain.Member;
import com.example.TableMate.dto.Member.MemberCreateRequest;
import com.example.TableMate.dto.Member.MemberResponse;
import com.example.TableMate.repository.MemberRepository;
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
                .liking(Liking.valueOf(request.liking()))
                .build();

        return memberRepository.save(member).getId();
    }

    public MemberResponse get(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        return MemberResponse.from(member);
    }
}
