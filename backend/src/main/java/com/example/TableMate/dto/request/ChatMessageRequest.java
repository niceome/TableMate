package com.example.TableMate.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {
    @NotBlank
    private String content;
}
