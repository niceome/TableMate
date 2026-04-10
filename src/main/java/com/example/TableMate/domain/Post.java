package com.example.TableMate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Table(name = "post")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "post_id")
    private Long id;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt;

    @Column(nullable = false, name = "post_title")
    private String title;

    @Column(nullable = false, name = "post_category")
    private String category;

    @Column(nullable = false, name = "post_due")
    private OffsetDateTime due;

    @Column(nullable = false, name = "post_party")
    private Long party;

    @Column(nullable = false, name = "post_content")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
