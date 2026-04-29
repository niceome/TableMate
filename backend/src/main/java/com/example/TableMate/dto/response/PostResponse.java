package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.Post;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.domain.enums.PostStatus;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
public class PostResponse {
    private final Long id;
    private final Long authorId;
    private final String authorName;
    private final Cafeteria cafeteria;
    private final FoodType foodType;
    private final LocalTime meetingTime;
    private final int maxParticipants;
    private final int currentParticipants;
    private final String content;
    private final PostStatus status;
    private final LocalDateTime createdAt;
    private final Long chatRoomId;

    public PostResponse(Post post, int currentParticipants) {
        this.id = post.getId();
        this.authorId = post.getAuthor().getId();
        this.authorName = post.getAuthor().getName();
        this.cafeteria = post.getCafeteria();
        this.foodType = post.getFoodType();
        this.meetingTime = post.getMeetingTime();
        this.maxParticipants = post.getMaxParticipants();
        this.currentParticipants = currentParticipants;
        this.content = post.getContent();
        this.status = post.getStatus();
        this.createdAt = post.getCreatedAt();
        this.chatRoomId = post.getChatRoom() != null ? post.getChatRoom().getId() : null;
    }
}
