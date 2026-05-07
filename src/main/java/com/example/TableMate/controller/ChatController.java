package com.example.TableMate.controller;

import com.example.TableMate.common.response.ApiResponse;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.dto.request.ChatMessageRequest;
import com.example.TableMate.dto.response.ChatMessageResponse;
import com.example.TableMate.dto.response.ChatRoomResponse;
import com.example.TableMate.service.ChatService;
import com.example.TableMate.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Tag(name = "Chat", description = "채팅 API (REST + WebSocket STOMP)")
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final MemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;

    @Operation(summary = "내 채팅방 목록 조회", description = "참가 수락된 모임의 채팅방 목록을 조회합니다.")
    @GetMapping("/api/chat/rooms")
    public ApiResponse<List<ChatRoomResponse>> getMyChatRooms(@AuthenticationPrincipal String username) {
        Member member = memberService.findByUsername(username);
        return ApiResponse.success(chatService.getMyChatRooms(member));
    }

    @Operation(summary = "채팅 메시지 내역 조회", description = "특정 채팅방의 이전 메시지 목록을 조회합니다.")
    @GetMapping("/api/chat/rooms/{roomId}/messages")
    public ApiResponse<List<ChatMessageResponse>> getChatMessages(
            @AuthenticationPrincipal String username,
            @PathVariable Long roomId) {
        Member member = memberService.findByUsername(username);
        return ApiResponse.success(chatService.getChatMessages(member, roomId));
    }

    
    
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            @Payload ChatMessageRequest request,
            Principal principal) {
        Member sender = memberService.findByUsername(principal.getName());
        ChatMessageResponse response = chatService.sendMessage(sender, roomId, request.getContent());
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, response);
    }
}
