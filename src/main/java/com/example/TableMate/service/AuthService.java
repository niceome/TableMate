package com.example.TableMate.service;

import com.example.TableMate.domain.Member;
import com.example.TableMate.dto.auth.LoginRequest;
import com.example.TableMate.dto.auth.LoginResponse;
import com.example.TableMate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByMemberEmail(request.email())
                .orElse(null);

        if (member == null) {
            return LoginResponse.fail();
        }

        if (!member.getMemberPassword().equals(request.password())) {
            return LoginResponse.fail();
        }

        return LoginResponse.success(
                member.getMemberId(),
                member.getMemberNickname()
        );
    }
}
