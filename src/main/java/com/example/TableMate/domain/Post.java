package com.example.TableMate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @Column(name = "post_title")
    private String title;

    @Column(name = "post_category")
    private String category;

    @Column(name = "post_due")
    private LocalDateTime dueTime;

    @Column(name = "post_party")
    private Long partySize;

    @Column(name = "post_content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "post_time")
    private OffsetDateTime postTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member writer;

    @PrePersist
    public void prePersist() {
        this.postTime = OffsetDateTime.now();
    }
}