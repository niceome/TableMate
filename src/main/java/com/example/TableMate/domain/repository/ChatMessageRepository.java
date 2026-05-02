package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.ChatMessage;
import com.example.TableMate.domain.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllByChatRoomOrderBySentAtAsc(ChatRoom chatRoom);
}
