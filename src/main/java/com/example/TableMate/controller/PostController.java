package com.example.TableMate.controller;

import com.example.TableMate.dto.Post.PostCreateRequest;
import com.example.TableMate.dto.Post.PostResponse;
import com.example.TableMate.dto.Post.PostSimpleResponse;
import com.example.TableMate.dto.Post.*;
import com.example.TableMate.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping("/create")
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