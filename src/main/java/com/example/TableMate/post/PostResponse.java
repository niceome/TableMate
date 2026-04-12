package com.example.tablemate.dto.post;

import com.example.tablemate.entity.Post;

public record PostResponse(
        Long id,
        String title,
        String category,
        String content,
        String writer
) {
    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory(),
                post.getContent(),
                post.getWriter().getNickname()
        );
    }
}
