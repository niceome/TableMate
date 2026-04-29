package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.dto.request.CreatePostRequest;
import com.example.TableMate.dto.request.UpdatePostRequest;
import com.example.TableMate.dto.response.PostResponse;
import com.example.TableMate.service.PostService;
import com.example.TableMate.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserService userService;

    @GetMapping
    public ApiResponse<List<PostResponse>> getPosts(
            @AuthenticationPrincipal String username,
            @RequestParam(required = false) Cafeteria cafeteria,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) String time) {
        Member member = userService.findByUsername(username);
        LocalTime meetingTime = time != null ? LocalTime.parse(time) : null;
        return ApiResponse.success(postService.getPosts(member, cafeteria, foodType, meetingTime));
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.success(postService.getPost(postId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostResponse> createPost(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody CreatePostRequest request) {
        Member member = userService.findByUsername(username);
        return ApiResponse.success(postService.createPost(member, request), "게시글 작성 성공");
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId,
            @RequestBody UpdatePostRequest request) {
        Member member = userService.findByUsername(username);
        return ApiResponse.success(postService.updatePost(member, postId, request));
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @AuthenticationPrincipal String username,
            @PathVariable Long postId) {
        Member member = userService.findByUsername(username);
        postService.deletePost(member, postId);
        return ApiResponse.success(null, "게시글 삭제 성공");
    }
}
