package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.dto.request.CreatePostRequest;
import com.example.TableMate.dto.request.UpdatePostRequest;
import com.example.TableMate.dto.response.PostResponse;
import com.example.TableMate.service.MemberService;
import com.example.TableMate.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@Tag(name = "Post", description = "밥 모임 게시글 API")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final MemberService memberService;

    @Operation(summary = "게시글 목록 조회", description = "식당, 음식 종류, 모임 시간으로 필터링하여 게시글 목록을 조회합니다.")
    @GetMapping
    public ApiResponse<List<PostResponse>> getPosts(
            @AuthenticationPrincipal String username,
            @RequestParam(required = false) Cafeteria cafeteria,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) String time) {
        Member member = memberService.findByUsername(username);
        LocalTime meetingTime = time != null ? LocalTime.parse(time) : null;
        return ApiResponse.success(postService.getPosts(member, cafeteria, foodType, meetingTime));
    }

    @Operation(summary = "게시글 단건 조회", description = "게시글 ID로 특정 게시글의 상세 정보를 조회합니다.")
    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.success(postService.getPost(postId));
    }

    @Operation(summary = "게시글 작성", description = "새로운 밥 모임 게시글을 작성합니다.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostResponse> createPost(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody CreatePostRequest request) {
        Member member = memberService.findByUsername(username);
        return ApiResponse.success(postService.createPost(member, request), "게시글 작성 성공");
    }

    @Operation(summary = "게시글 수정", description = "본인이 작성한 게시글의 내용을 수정합니다.")
    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @RequestBody UpdatePostRequest request) {
        Member member = memberService.findByUsername(username);
        return ApiResponse.success(postService.updatePost(member, postId, request));
    }

    @Operation(summary = "게시글 삭제", description = "본인이 작성한 게시글을 삭제합니다.")
    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = memberService.findByUsername(username);
        postService.deletePost(member, postId);
        return ApiResponse.success(null, "게시글 삭제 성공");
    }
}
