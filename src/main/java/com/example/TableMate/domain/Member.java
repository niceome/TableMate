package com.example.TableMate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "member_id")
    private Long id;

    @Column(nullable = false, name = "member_email")
    private String email;

    @Column(nullable = false, name = "member_password")
    private String password;

    @Column(nullable = false, name = "member_nickname")
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "member_liking")
    private Liking liking;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
    }
}
