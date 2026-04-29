package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.ChatRoom;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChatRoomResponse {
    private final Long id;
    private final Long postId;
    private final String postContent;
    private final LocalDateTime createdAt;

    public ChatRoomResponse(ChatRoom chatRoom) {
        this.id = chatRoom.getId();
        this.postId = chatRoom.getPost().getId();
        this.postContent = chatRoom.getPost().getContent();
        this.createdAt = chatRoom.getCreatedAt();
    }
}
