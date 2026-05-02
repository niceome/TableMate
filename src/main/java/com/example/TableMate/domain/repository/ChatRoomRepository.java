package com.example.TableMate.domain.repository;

import com.example.TableMate.domain.entity.ChatRoom;
import com.example.TableMate.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.members crm WHERE crm.member = :member")
    List<ChatRoom> findAllByMember(@Param("member") Member member);

    Optional<ChatRoom> findByPostId(Long postId);
}
