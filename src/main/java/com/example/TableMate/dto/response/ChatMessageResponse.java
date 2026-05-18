package com.example.TableMate.dto.response;

import com.example.TableMate.domain.entity.ChatMessage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChatMessageResponse {

    private final Long id;
    @JsonProperty("isBot")
    private final boolean isBot;
    private final Long senderId;
    private final String senderName;
    private final String content;
    private final LocalDateTime sentAt;

    public ChatMessageResponse(ChatMessage message) {
        this.id = message.getId();
        this.isBot = message.isBot();
        this.senderId = message.isBot() ? null : message.getSender().getId();
        this.senderName = message.isBot() ? "TableMate Bot" : message.getSender().getName();
        this.content = message.getContent();
        this.sentAt = message.getSentAt();
    }
}
