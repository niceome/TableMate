package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.dto.request.LoginRequest;
import com.example.TableMate.dto.request.SignupRequest;
import com.example.TableMate.dto.response.AuthResponse;
import com.example.TableMate.dto.response.UserResponse;
import com.example.TableMate.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "인증 API (회원가입 / 로그인)")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "이름, 아이디, 비밀번호, 음식 선호도를 입력하여 회원가입합니다.")
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ApiResponse.success(authService.signup(request), "회원가입 성공");
    }

    @Operation(summary = "로그인", description = "아이디와 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "로그인 성공");
    }

}
