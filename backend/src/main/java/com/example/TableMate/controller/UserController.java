package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.dto.request.UpdateUserRequest;
import com.example.TableMate.dto.response.UserResponse;
import com.example.TableMate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyInfo(@AuthenticationPrincipal String username) {
        return ApiResponse.success(userService.getMyInfo(username));
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMyInfo(
            @AuthenticationPrincipal String username,
            @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(userService.updateMyInfo(username, request));
    }
}
