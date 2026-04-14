package com.example.TableMate.dto.Post;

import com.example.TableMate.domain.Post;

public record PostResponse(
        Long id,
        String title,
        String category,
        String content,
        Long party,
        String writer
) {
    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory(),
                post.getContent(),
                post.getParty(),
                post.getWriter().getNickname()
        );
    }
}
