package com.example.TableMate.controller;

import com.example.TableMate.dto.auth.LoginRequest;
import com.example.TableMate.dto.auth.LoginResponse;
import com.example.TableMate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
