package com.example.TableMate.dto.Post;

import com.example.TableMate.domain.Post;

public record PostSimpleResponse(
        Long id,
        String title,
        String category,
        String writer
) {
    public static PostSimpleResponse from(Post post) {
        return new PostSimpleResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory(),
                post.getWriter().getNickname()
        );
    }
}
