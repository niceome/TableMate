package com.example.tablemate.controller;

import com.example.tablemate.dto.post.*;
import com.example.tablemate.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public Long create(@RequestBody PostCreateRequest request) {
        return postService.create(request);
    }

    @GetMapping
    public List<PostSimpleResponse> getAll() {
        return postService.getAll();
    }

    @GetMapping("/{id}")
    public PostResponse get(@PathVariable Long id) {
        return postService.get(id);
    }
}
