package com.example.TableMate.repository;

import com.example.TableMate.domain.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<Chatroom, Long> {
}
