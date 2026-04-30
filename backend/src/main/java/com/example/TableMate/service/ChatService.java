package com.example.TableMate.service;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.ChatMessage;
import com.example.TableMate.domain.entity.ChatRoom;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.repository.ChatMessageRepository;
import com.example.TableMate.domain.repository.ChatRoomMemberRepository;
import com.example.TableMate.domain.repository.ChatRoomRepository;
import com.example.TableMate.dto.response.ChatMessageResponse;
import com.example.TableMate.dto.response.ChatRoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getMyChatRooms(Member member) {
        return chatRoomRepository.findAllByMember(member).stream()
                .map(ChatRoomResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getChatMessages(Member member, Long roomId) {
        ChatRoom chatRoom = findChatRoom(roomId);
        validateMembership(chatRoom, member);
        return chatMessageRepository.findAllByChatRoomOrderBySentAtAsc(chatRoom).stream()
                .map(ChatMessageResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageResponse sendMessage(Member sender, Long roomId, String content) {
        ChatRoom chatRoom = findChatRoom(roomId);
        validateMembership(chatRoom, sender);
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(content)
                .build();
        chatMessageRepository.save(message);
        return new ChatMessageResponse(message);
    }

    private ChatRoom findChatRoom(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));
    }

    private void validateMembership(ChatRoom chatRoom, Member member) {
        if (!chatRoomMemberRepository.existsByChatRoomAndMember(chatRoom, member)) {
            throw new CustomException(ErrorCode.NOT_CHAT_ROOM_MEMBER);
        }
    }
}
