package com.example.TableMate.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "member_id")
    private Long id;

    @Column(nullable = false, name = "member_email")
    private String memberEmail;

    @Column(nullable = false, name = "member_password")
    private String memberPassword;

    @Column(nullable = false, name = "member_nickname")
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "member_liking")
    private Liking liking;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;
}
