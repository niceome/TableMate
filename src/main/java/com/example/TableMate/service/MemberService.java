package com.example.TableMate.service;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.repository.MemberRepository;
import com.example.TableMate.dto.request.UpdateUserRequest;
import com.example.TableMate.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class
MemberService {

    private final MemberRepository memberRepository;

    // 개인 정보 불러올때
    @Transactional(readOnly = true)
    public UserResponse getMyInfo(String username) {
        return new UserResponse(findByUsername(username));
    }

    // 개인 정보 수정할때
    @Transactional
    public UserResponse updateMyInfo(String username, UpdateUserRequest request) {
        Member member = findByUsername(username);
        if (request.getName() != null) {
            member.setName(request.getName());
        }
        if (request.getFoodPreferences() != null) {
            member.setFoodPreferences(request.getFoodPreferences());
        }
        return new UserResponse(member);
    }

    // memberRepository에 있는 매서드 예외 처리
    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
    }
}
