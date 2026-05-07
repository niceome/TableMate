package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.dto.request.UpdateUserRequest;
import com.example.TableMate.dto.response.UserResponse;
import com.example.TableMate.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "사용자 정보 API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final MemberService memberService;

    @Operation(summary = "내 정보 조회", description = "JWT 토큰으로 인증된 본인의 프로필 정보를 조회합니다.")
    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyInfo(@AuthenticationPrincipal String username) {
        return ApiResponse.success(memberService.getMyInfo(username));
    }

    @Operation(summary = "내 정보 수정", description = "본인의 이름 또는 음식 선호도를 수정합니다.")
    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMyInfo(
            @AuthenticationPrincipal String username,
            @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(memberService.updateMyInfo(username, request));
    }
}
