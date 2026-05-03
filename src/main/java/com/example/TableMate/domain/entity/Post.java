package com.example.TableMate.domain.entity;

import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.domain.enums.PostStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Member author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cafeteria cafeteria;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type", nullable = false)
    private FoodType foodType;

    @Column(name = "meeting_time", nullable = false)
    private LocalTime meetingTime;

    @Column(name = "max_participants", nullable = false)
    private int maxParticipants;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PostStatus status = PostStatus.OPEN;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL)
    private ChatRoom chatRoom;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
