package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.ChatMessage;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChatMessageResponse {

    private final Long id;
    private final Long senderId;
    private final String senderName;
    private final String content;
    private final LocalDateTime sentAt;

    public ChatMessageResponse(ChatMessage message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.senderName = message.getSender().getName();
        this.content = message.getContent();
        this.sentAt = message.getSentAt();
    }
}
