package com.example.TableMate.service;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.*;
import com.example.TableMate.domain.enums.*;
import com.example.TableMate.domain.repository.ApplicationRepository;
import com.example.TableMate.domain.repository.ChatRoomMemberRepository;
import com.example.TableMate.domain.repository.ChatRoomRepository;
import com.example.TableMate.domain.repository.PostRepository;
import com.example.TableMate.dto.request.CreatePostRequest;
import com.example.TableMate.dto.request.UpdatePostRequest;
import com.example.TableMate.dto.response.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ApplicationRepository applicationRepository;


    // 게시물 생성
    @Transactional
    public PostResponse createPost(Member author, CreatePostRequest request) {
        Post post = Post.builder()
                .author(author)
                .cafeteria(request.getCafeteria())
                .foodType(request.getFoodType())
                .meetingTime(request.getMeetingTime())
                .maxParticipants(request.getMaxParticipants())
                .content(request.getContent())
                .status(PostStatus.OPEN)
                .build();
        postRepository.save(post);

        ChatRoom chatRoom = ChatRoom.builder().post(post).build();
        chatRoomRepository.save(chatRoom);

        chatRoomMemberRepository.save(ChatRoomMember.builder()
                .chatRoom(chatRoom)
                .member(author)
                .build());

        post.setChatRoom(chatRoom);
        return new PostResponse(post, 1);
    }

    // 게시글 목록 조회
    @Transactional(readOnly = true)
    public List<PostResponse> getPosts(Member member, Cafeteria cafeteria, FoodType foodType, LocalTime meetingTime) {
        Set<FoodType> preferences = member.getFoodPreferences();
        return postRepository.findAll().stream()
                .filter(p -> cafeteria == null || p.getCafeteria() == cafeteria)
                .filter(p -> foodType == null || p.getFoodType() == foodType)
                .filter(p -> meetingTime == null || p.getMeetingTime().equals(meetingTime))
                .sorted(Comparator
                        .comparingInt((Post p) -> preferences.contains(p.getFoodType()) ? 0 : 1)
                        .thenComparing(Comparator.comparing(Post::getCreatedAt).reversed()))
                .map(p -> new PostResponse(p, getAcceptedCount(p)))
                .collect(Collectors.toList());
    }

    // 게시물 단건 조회
    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = findById(postId);
        return new PostResponse(post, getAcceptedCount(post));
    }

    // 게시물 수정
    @Transactional
    public PostResponse updatePost(Member member, Long postId, UpdatePostRequest request) {
        Post post = findById(postId);
        checkAuthor(post, member);
        if (request.getCafeteria() != null) post.setCafeteria(request.getCafeteria());
        if (request.getFoodType() != null) post.setFoodType(request.getFoodType());
        if (request.getMeetingTime() != null) post.setMeetingTime(request.getMeetingTime());
        if (request.getMaxParticipants() != null) post.setMaxParticipants(request.getMaxParticipants());
        if (request.getContent() != null) post.setContent(request.getContent());
        return new PostResponse(post, getAcceptedCount(post));
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(Member member, Long postId) {
        Post post = findById(postId);
        checkAuthor(post, member);
        postRepository.delete(post);
    }

    public Post findById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
    }

    // 게시글 작성자 맞는지 확인하고 아니면 예외
    private void checkAuthor(Post post, Member member) {
        if (!post.getAuthor().getId().equals(member.getId())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
    }

    private int getAcceptedCount(Post post) {
        return (int) applicationRepository.countByPostAndStatus(post, ApplicationStatus.ACCEPTED) + 1;
    }
}
