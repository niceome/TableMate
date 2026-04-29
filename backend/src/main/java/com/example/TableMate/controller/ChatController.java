package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.dto.request.ChatMessageRequest;
import com.example.TableMate.dto.response.ChatMessageResponse;
import com.example.TableMate.dto.response.ChatRoomResponse;
import com.example.TableMate.service.ChatService;
import com.example.TableMate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/api/chat/rooms")
    public ApiResponse<List<ChatRoomResponse>> getMyChatRooms(@AuthenticationPrincipal String username) {
        Member member = userService.findByUsername(username);
        return ApiResponse.success(chatService.getMyChatRooms(member));
    }

    @GetMapping("/api/chat/rooms/{roomId}/messages")
    public ApiResponse<List<ChatMessageResponse>> getChatMessages(
            @AuthenticationPrincipal String username,
            @PathVariable Long roomId) {
        Member member = userService.findByUsername(username);
        return ApiResponse.success(chatService.getChatMessages(member, roomId));
    }

    /**
     * STOMP 메시지 수신: /pub/chat/{roomId}
     * 브로드캐스트: /sub/chat/{roomId}
     */
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            @Payload ChatMessageRequest request,
            Principal principal) {
        Member sender = userService.findByUsername(principal.getName());
        ChatMessageResponse response = chatService.sendMessage(sender, roomId, request.getContent());
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, response);
    }
}
