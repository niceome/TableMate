package com.example.TableMate.service;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.*;
import com.example.TableMate.domain.enums.ApplicationStatus;
import com.example.TableMate.domain.enums.PostStatus;
import com.example.TableMate.domain.repository.ApplicationRepository;
import com.example.TableMate.domain.repository.ChatRoomMemberRepository;
import com.example.TableMate.domain.repository.ChatRoomRepository;
import com.example.TableMate.dto.response.ApplicantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final PostService postService;

    @Transactional
    public void apply(Member applicant, Long postId) {
        Post post = postService.findById(postId);

        if (post.getAuthor().getId().equals(applicant.getId())) {
            throw new CustomException(ErrorCode.CANNOT_APPLY_OWN_POST);
        }
        if (post.getStatus() == PostStatus.CLOSED) {
            throw new CustomException(ErrorCode.POST_ALREADY_CLOSED);
        }
        if (applicationRepository.existsByPostAndApplicant(post, applicant)) {
            throw new CustomException(ErrorCode.ALREADY_APPLIED);
        }

        applicationRepository.save(Application.builder()
                .post(post)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .build());
    }

    @Transactional(readOnly = true)
    public List<ApplicantResponse> getApplicants(Member author, Long postId) {
        Post post = postService.findById(postId);
        checkAuthor(post, author);
        return applicationRepository.findAllByPost(post).stream()
                .map(ApplicantResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void accept(Member author, Long postId, Long userId) {
        Post post = postService.findById(postId);
        checkAuthor(post, author);

        if (post.getStatus() == PostStatus.CLOSED) {
            throw new CustomException(ErrorCode.POST_ALREADY_CLOSED);
        }

        Application application = applicationRepository.findAllByPost(post).stream()
                .filter(a -> a.getApplicant().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));

        application.setStatus(ApplicationStatus.ACCEPTED);

        ChatRoom chatRoom = chatRoomRepository.findByPostId(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        if (!chatRoomMemberRepository.existsByChatRoomAndMember(chatRoom, application.getApplicant())) {
            chatRoomMemberRepository.save(ChatRoomMember.builder()
                    .chatRoom(chatRoom)
                    .member(application.getApplicant())
                    .build());
        }

        // Close post if now full (author + accepted == maxParticipants)
        long acceptedCount = applicationRepository.countByPostAndStatus(post, ApplicationStatus.ACCEPTED);
        if (1 + acceptedCount >= post.getMaxParticipants()) {
            post.setStatus(PostStatus.CLOSED);
        }
    }

    @Transactional
    public void reject(Member author, Long postId, Long userId) {
        Post post = postService.findById(postId);
        checkAuthor(post, author);

        Application application = applicationRepository.findAllByPost(post).stream()
                .filter(a -> a.getApplicant().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));

        application.setStatus(ApplicationStatus.REJECTED);
    }

    private void checkAuthor(Post post, Member author) {
        if (!post.getAuthor().getId().equals(author.getId())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
    }
}
