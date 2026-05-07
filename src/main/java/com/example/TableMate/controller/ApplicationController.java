package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.dto.response.ApplicantResponse;
import com.example.TableMate.service.ApplicationService;
import com.example.TableMate.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Application", description = "밥 모임 참가 신청 API")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final MemberService memberService;

    @Operation(summary = "참가 신청", description = "특정 밥 모임 게시글에 참가를 신청합니다.")
    @PostMapping("/{postId}/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> apply(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = memberService.findByUsername(username);
        applicationService.apply(member, postId);
        return ApiResponse.success(null, "신청 완료");
    }

    @Operation(summary = "신청자 목록 조회", description = "게시글 작성자가 본인 게시글의 신청자 목록을 조회합니다.")
    @GetMapping("/{postId}/applicants")
    public ApiResponse<List<ApplicantResponse>> getApplicants(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = memberService.findByUsername(username);
        return ApiResponse.success(applicationService.getApplicants(member, postId));
    }

    @Operation(summary = "신청 수락", description = "게시글 작성자가 특정 신청자의 참가 신청을 수락합니다.")
    @PostMapping("/{postId}/applicants/{userId}/accept")
    public ApiResponse<Void> accept(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @PathVariable Long userId) {
        Member member = memberService.findByUsername(username);
        applicationService.accept(member, postId, userId);
        return ApiResponse.success(null, "수락 완료");
    }

    @Operation(summary = "신청 거절", description = "게시글 작성자가 특정 신청자의 참가 신청을 거절합니다.")
    @PostMapping("/{postId}/applicants/{userId}/reject")
    public ApiResponse<Void> reject(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @PathVariable Long userId) {
        Member member = memberService.findByUsername(username);
        applicationService.reject(member, postId, userId);
        return ApiResponse.success(null, "거절 완료");
    }
}
