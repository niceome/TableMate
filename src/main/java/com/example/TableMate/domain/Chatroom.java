package com.example.TableMate.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Getter
@Table(name = "chatroom")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chatroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "chatroom_id")
    private Long id;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;
}
