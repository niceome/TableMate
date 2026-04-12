package com.example.tablemate.dto.post;

import java.time.LocalDateTime;

public record PostCreateRequest(
        String title,
        String category,
        LocalDateTime dueTime,
        Long party,
        String content,
        Long memberId
) {}
