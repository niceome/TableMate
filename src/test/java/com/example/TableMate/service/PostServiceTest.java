package com.example.TableMate.service;

import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.ChatRoom;
import com.example.TableMate.domain.entity.ChatRoomMember;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.entity.Post;
import com.example.TableMate.domain.enums.ApplicationStatus;
import com.example.TableMate.domain.enums.Cafeteria;
import com.example.TableMate.domain.enums.FoodType;
import com.example.TableMate.domain.enums.PostStatus;
import com.example.TableMate.domain.repository.ApplicationRepository;
import com.example.TableMate.domain.repository.ChatRoomMemberRepository;
import com.example.TableMate.domain.repository.ChatRoomRepository;
import com.example.TableMate.domain.repository.PostRepository;
import com.example.TableMate.dto.request.CreatePostRequest;
import com.example.TableMate.dto.request.UpdatePostRequest;
import com.example.TableMate.dto.response.PostResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ChatRoomRepository chatRoomRepository;

    @Mock
    private ChatRoomMemberRepository chatRoomMemberRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ChatService chatService;

    @InjectMocks
    private PostService postService;

    @Test
    @DisplayName("게시글 생성 시 게시글, 채팅방, 채팅방 멤버가 저장된다")
    void createPost() {
        Member author = member(1L, "writer", FoodType.KOREAN);
        CreatePostRequest request = new CreatePostRequest();
        request.setCafeteria(Cafeteria.CHEONJI);
        request.setFoodType(FoodType.KOREAN);
        request.setMeetingTime(LocalTime.of(12, 30));
        request.setMaxParticipants(4);
        request.setContent("lunch together");

        PostResponse response = postService.createPost(author, request);

        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());
        Post savedPost = postCaptor.getValue();

        assertThat(savedPost.getAuthor()).isEqualTo(author);
        assertThat(savedPost.getCafeteria()).isEqualTo(Cafeteria.CHEONJI);
        assertThat(savedPost.getFoodType()).isEqualTo(FoodType.KOREAN);
        assertThat(savedPost.getStatus()).isEqualTo(PostStatus.OPEN);
        assertThat(savedPost.getChatRoom()).isNotNull();
        assertThat(response.getCurrentParticipants()).isEqualTo(1);
        assertThat(response.getContent()).isEqualTo("lunch together");

        verify(chatRoomRepository).save(any(ChatRoom.class));
        verify(chatRoomMemberRepository).save(any(ChatRoomMember.class));
        verify(chatService).sendBotMessage(any(ChatRoom.class), any(String.class));
    }

    @Test
    @DisplayName("게시글 목록은 식당과 시간으로 필터링되고 선호 음식과 최신순으로 정렬된다")
    void getPosts() {
        Member member = member(1L, "reader", FoodType.KOREAN);
        Post oldPreferred = post(1L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "old korean", LocalDateTime.of(2026, 5, 1, 12, 0));
        Post newPreferred = post(2L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "new korean", LocalDateTime.of(2026, 5, 2, 12, 0));
        Post notPreferred = post(3L, member, Cafeteria.CHEONJI, FoodType.JAPANESE,
                LocalTime.of(12, 0), "japanese", LocalDateTime.of(2026, 5, 3, 12, 0));
        Post otherCafeteria = post(4L, member, Cafeteria.BAENGNO, FoodType.KOREAN,
                LocalTime.of(12, 0), "other cafeteria", LocalDateTime.of(2026, 5, 4, 12, 0));

        when(postRepository.findAll()).thenReturn(List.of(oldPreferred, notPreferred, newPreferred, otherCafeteria));
        when(applicationRepository.countByPostAndStatus(any(Post.class), any(ApplicationStatus.class))).thenReturn(2L);

        List<PostResponse> responses = postService.getPosts(member, Cafeteria.CHEONJI, null, LocalTime.of(12, 0));

        assertThat(responses).extracting(PostResponse::getContent)
                .containsExactly("new korean", "old korean", "japanese");
        assertThat(responses).extracting(PostResponse::getCurrentParticipants)
                .containsExactly(3, 3, 3);
    }

    @Test
    @DisplayName("필터가 없으면 전체 게시글을 선호 음식 우선으로 조회한다")
    void getPostsWithoutFilters() {
        Member member = member(1L, "reader", FoodType.KOREAN);
        Post preferred = post(1L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "preferred", LocalDateTime.of(2026, 5, 1, 12, 0));
        Post notPreferred = post(2L, member, Cafeteria.BAENGNO, FoodType.JAPANESE,
                LocalTime.of(13, 0), "not preferred", LocalDateTime.of(2026, 5, 2, 12, 0));

        when(postRepository.findAll()).thenReturn(List.of(notPreferred, preferred));
        when(applicationRepository.countByPostAndStatus(any(Post.class), any(ApplicationStatus.class))).thenReturn(0L);

        List<PostResponse> responses = postService.getPosts(member, null, null, null);

        assertThat(responses).extracting(PostResponse::getContent)
                .containsExactly("preferred", "not preferred");
    }

    @Test
    @DisplayName("음식 종류 조건으로 게시글 목록을 필터링한다")
    void getPostsFiltersByFoodType() {
        Member member = member(1L, "reader", FoodType.KOREAN);
        Post korean = post(1L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "korean", LocalDateTime.of(2026, 5, 1, 12, 0));
        Post japanese = post(2L, member, Cafeteria.CHEONJI, FoodType.JAPANESE,
                LocalTime.of(12, 0), "japanese", LocalDateTime.of(2026, 5, 2, 12, 0));

        when(postRepository.findAll()).thenReturn(List.of(japanese, korean));
        when(applicationRepository.countByPostAndStatus(any(Post.class), any(ApplicationStatus.class))).thenReturn(0L);

        List<PostResponse> responses = postService.getPosts(member, null, FoodType.KOREAN, null);

        assertThat(responses).extracting(PostResponse::getContent)
                .containsExactly("korean");
    }

    @Test
    @DisplayName("모임 시간 조건으로 게시글 목록을 필터링한다")
    void getPostsFiltersByMeetingTime() {
        Member member = member(1L, "reader", FoodType.KOREAN);
        Post lunch = post(1L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "lunch", LocalDateTime.of(2026, 5, 1, 12, 0));
        Post dinner = post(2L, member, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(18, 0), "dinner", LocalDateTime.of(2026, 5, 2, 12, 0));

        when(postRepository.findAll()).thenReturn(List.of(dinner, lunch));
        when(applicationRepository.countByPostAndStatus(any(Post.class), any(ApplicationStatus.class))).thenReturn(0L);

        List<PostResponse> responses = postService.getPosts(member, null, null, LocalTime.of(12, 0));

        assertThat(responses).extracting(PostResponse::getContent)
                .containsExactly("lunch");
    }

    @Test
    @DisplayName("게시글 단건 조회 시 작성자와 수락된 신청자를 현재 참여 인원으로 계산한다")
    void getPost() {
        Member author = member(1L, "writer", FoodType.WESTERN);
        Post post = post(10L, author, Cafeteria.KNUTERIA, FoodType.WESTERN,
                LocalTime.of(18, 30), "dinner", LocalDateTime.of(2026, 5, 1, 18, 0));

        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(applicationRepository.countByPostAndStatus(post, ApplicationStatus.ACCEPTED)).thenReturn(2L);

        PostResponse response = postService.getPost(10L);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getCurrentParticipants()).isEqualTo(3);
    }

    @Test
    @DisplayName("작성자는 게시글을 수정할 수 있다")
    void updatePostByAuthor() {
        Member author = member(1L, "writer", FoodType.CHINESE);
        Post post = post(20L, author, Cafeteria.CHEONJI, FoodType.CHINESE,
                LocalTime.of(11, 0), "before", LocalDateTime.of(2026, 5, 1, 11, 0));
        UpdatePostRequest request = new UpdatePostRequest();
        request.setCafeteria(Cafeteria.BAENGNO);
        request.setFoodType(FoodType.WESTERN);
        request.setMeetingTime(LocalTime.of(13, 0));
        request.setMaxParticipants(5);
        request.setContent("after");

        when(postRepository.findById(20L)).thenReturn(Optional.of(post));

        PostResponse response = postService.updatePost(author, 20L, request);

        assertThat(response.getCafeteria()).isEqualTo(Cafeteria.BAENGNO);
        assertThat(response.getFoodType()).isEqualTo(FoodType.WESTERN);
        assertThat(response.getMeetingTime()).isEqualTo(LocalTime.of(13, 0));
        assertThat(response.getMaxParticipants()).isEqualTo(5);
        assertThat(response.getContent()).isEqualTo("after");
    }

    @Test
    @DisplayName("수정 요청 값이 null이면 기존 게시글 값이 유지된다")
    void updatePostKeepsValuesWhenRequestFieldsAreNull() {
        Member author = member(1L, "writer", FoodType.CHINESE);
        Post post = post(21L, author, Cafeteria.CHEONJI, FoodType.CHINESE,
                LocalTime.of(11, 0), "original", LocalDateTime.of(2026, 5, 1, 11, 0));

        when(postRepository.findById(21L)).thenReturn(Optional.of(post));

        PostResponse response = postService.updatePost(author, 21L, new UpdatePostRequest());

        assertThat(response.getCafeteria()).isEqualTo(Cafeteria.CHEONJI);
        assertThat(response.getFoodType()).isEqualTo(FoodType.CHINESE);
        assertThat(response.getMeetingTime()).isEqualTo(LocalTime.of(11, 0));
        assertThat(response.getMaxParticipants()).isEqualTo(4);
        assertThat(response.getContent()).isEqualTo("original");
    }

    @Test
    @DisplayName("작성자가 아니면 게시글을 수정할 수 없다")
    void updatePostByNonAuthorThrowsException() {
        Member author = member(1L, "writer", FoodType.KOREAN);
        Member other = member(2L, "other", FoodType.JAPANESE);
        Post post = post(30L, author, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "content", LocalDateTime.of(2026, 5, 1, 12, 0));

        when(postRepository.findById(30L)).thenReturn(Optional.of(post));

        assertThatThrownBy(() -> postService.updatePost(other, 30L, new UpdatePostRequest()))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.UNAUTHORIZED_ACCESS);
    }

    @Test
    @DisplayName("작성자는 게시글을 삭제할 수 있다")
    void deletePostByAuthor() {
        Member author = member(1L, "writer", FoodType.KOREAN);
        Post post = post(40L, author, Cafeteria.CHEONJI, FoodType.KOREAN,
                LocalTime.of(12, 0), "delete me", LocalDateTime.of(2026, 5, 1, 12, 0));

        when(postRepository.findById(40L)).thenReturn(Optional.of(post));

        postService.deletePost(author, 40L);

        verify(postRepository).delete(post);
    }

    @Test
    @DisplayName("존재하지 않는 게시글을 조회하면 예외가 발생한다")
    void findByIdThrowsException() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getPost(999L))
                .isInstanceOf(CustomException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.POST_NOT_FOUND);

        verify(applicationRepository, never()).countByPostAndStatus(any(Post.class), any(ApplicationStatus.class));
    }

    private Member member(Long id, String username, FoodType preference) {
        return Member.builder()
                .id(id)
                .name(username + " name")
                .username(username)
                .password("password")
                .foodPreferences(Set.of(preference))
                .build();
    }

    private Post post(Long id, Member author, Cafeteria cafeteria, FoodType foodType,
                      LocalTime meetingTime, String content, LocalDateTime createdAt) {
        return Post.builder()
                .id(id)
                .author(author)
                .cafeteria(cafeteria)
                .foodType(foodType)
                .meetingTime(meetingTime)
                .maxParticipants(4)
                .content(content)
                .status(PostStatus.OPEN)
                .createdAt(createdAt)
                .build();
    }
}
