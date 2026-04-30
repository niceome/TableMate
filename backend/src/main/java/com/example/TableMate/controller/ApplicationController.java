package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.dto.response.ApplicantResponse;
import com.example.TableMate.service.ApplicationService;
import com.example.TableMate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserService userService;

    @PostMapping("/{postId}/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> apply(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = userService.findByUsername(username);
        applicationService.apply(member, postId);
        return ApiResponse.success(null, "신청 완료");
    }

    @GetMapping("/{postId}/applicants")
    public ApiResponse<List<ApplicantResponse>> getApplicants(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = userService.findByUsername(username);
        return ApiResponse.success(applicationService.getApplicants(member, postId));
    }

    @PostMapping("/{postId}/applicants/{userId}/accept")
    public ApiResponse<Void> accept(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @PathVariable Long userId) {
        Member member = userService.findByUsername(username);
        applicationService.accept(member, postId, userId);
        return ApiResponse.success(null, "수락 완료");
    }

    @PostMapping("/{postId}/applicants/{userId}/reject")
    public ApiResponse<Void> reject(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @PathVariable Long userId) {
        Member member = userService.findByUsername(username);
        applicationService.reject(member, postId, userId);
        return ApiResponse.success(null, "거절 완료");
    }
}
