package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.ChatRoom;
import com.example.TableMate.domain.entity.ChatRoomMember;
import com.example.TableMate.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    boolean existsByChatRoomAndMember(ChatRoom chatRoom, Member member);
}
