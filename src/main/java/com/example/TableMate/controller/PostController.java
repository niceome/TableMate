package com.example.TableMate.controller;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.domain.repository.MemberRepository;
import com.example.TableMate.dto.request.CreatePostRequest;
import com.example.TableMate.dto.request.UpdatePostRequest;
import com.example.TableMate.dto.response.PostResponse;
import com.example.TableMate.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final MemberRepository memberRepository;

    // 게시글 생성
    @PostMapping
    public ApiResponse<PostResponse> createPost(
            Authentication authentication,
            @Valid @RequestBody CreatePostRequest request
    ) {
        Member member = getLoginMember(authentication);
        return ApiResponse.success(postService.createPost(member, request), "게시글 작성 성공");
    }

    // 게시글 목록 조회
    @GetMapping
    public ApiResponse<List<PostResponse>> getPosts(
            Authentication authentication,
            @RequestParam(required = false) Cafeteria cafeteria,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) LocalTime meetingTime
    ) {
        Member member = getLoginMember(authentication);
        return ApiResponse.success(postService.getPosts(member, cafeteria, foodType, meetingTime));
    }

    // 게시글 단건 조회
    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.success(postService.getPost(postId));
    }

    // 게시글 수정
    @PatchMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            Authentication authentication,
            @PathVariable Long postId,
            @RequestBody UpdatePostRequest request
    ) {
        Member member = getLoginMember(authentication);
        return ApiResponse.success(postService.updatePost(member, postId, request), "게시글 수정 성공");
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            Authentication authentication,
            @PathVariable Long postId
    ) {
        Member member = getLoginMember(authentication);
        postService.deletePost(member, postId);
        return ApiResponse.success(null, "게시글 삭제 성공");
    }

    // 로그인 사용자 조회
    private Member getLoginMember(Authentication authentication) {
        return memberRepository.findById(1L)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}