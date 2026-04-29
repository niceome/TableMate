package com.example.TableMate.controller;

import com.example.TableMate.dto.Member.MemberCreateRequest;
import com.example.TableMate.dto.Member.MemberResponse;
import com.example.TableMate.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public Long create(@RequestBody MemberCreateRequest request) {
        return memberService.create(request);
    }

    @GetMapping("/{id}")
    public MemberResponse get(@PathVariable Long id) {
        return memberService.get(id);
    }
}
