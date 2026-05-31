import com.example.TableMate.common.exception.CustomException;
import com.example.TableMate.common.exception.ErrorCode;
import com.example.TableMate.domain.entity.ChatMessage;
import com.example.TableMate.domain.entity.ChatRoom;
import com.example.TableMate.domain.entity.Member;
import com.example.TableMate.domain.entity.Post;
import com.example.TableMate.domain.repository.ChatMessageRepository;
import com.example.TableMate.domain.repository.ChatRoomMemberRepository;
import com.example.TableMate.domain.repository.ChatRoomRepository;
import com.example.TableMate.dto.response.ChatMessageResponse;
import com.example.TableMate.dto.response.ChatRoomResponse;
import com.example.TableMate.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRoomRepository chatRoomRepository;
    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatService chatService;

    private Member member;
    private ChatRoom chatRoom;

    @BeforeEach
    void setUp() {
        member = Member.builder().id(1L).username("테스트유저").build();
        chatRoom = ChatRoom.builder().id(100L).build();
    }

    @Test
    @DisplayName("메시지 전송 성공 - 멤버십 검증 통과 시")
    void sendMessage_Success() {
        // given
        String content = "안녕하세요!";
        given(chatRoomRepository.findById(100L)).willReturn(Optional.of(chatRoom));
        given(chatRoomMemberRepository.existsByChatRoomAndMember(chatRoom, member)).willReturn(true);

        // when
        ChatMessageResponse response = chatService.sendMessage(member, 100L, content);

        // then
        assertThat(response.getContent()).isEqualTo(content);
        verify(chatMessageRepository, times(1)).save(any(ChatMessage.class));
    }

    @Test
    @DisplayName("메시지 전송 실패 - 채팅방 멤버가 아닐 때")
    void sendMessage_Fail_NotMember() {
        // given
        given(chatRoomRepository.findById(100L)).willReturn(Optional.of(chatRoom));
        given(chatRoomMemberRepository.existsByChatRoomAndMember(chatRoom, member)).willReturn(false);

        // when & then
        assertThatThrownBy(() -> chatService.sendMessage(member, 100L, "안녕"))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.NOT_CHAT_ROOM_MEMBER);
    }

    @Test
    @DisplayName("봇 메시지 전송 - DB 저장 및 STOMP 메시지 발행 확인")
    void sendBotMessage_Success() {
        // given
        String botContent = "새로운 멤버가 입장했습니다.";

        // when
        chatService.sendBotMessage(chatRoom, botContent);

        // then
        // 메시지 저장 완료?
        verify(chatMessageRepository, times(1)).save(any(ChatMessage.class));
        // 해당 토픽으로 메시지 전송?
        verify(messagingTemplate, times(1))
                .convertAndSend(eq("/sub/chat/" + chatRoom.getId()), any(ChatMessageResponse.class));
    }

    @Test
    @DisplayName("채팅방 조회 실패 - 존재하지 않는 방 ID")
    void findChatRoom_Fail_NotFound() {
        // given
        given(chatRoomRepository.findById(999L)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> chatService.getChatMessages(member, 999L))
                .isInstanceOf(CustomException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.CHAT_ROOM_NOT_FOUND);
    }

    @Test
    @DisplayName("내 채팅방 목록 조회 성공")
    void getMyChatRooms_Success() {
        // 1. Post 객체 먼저 생성
        Post mockPost = Post.builder()
                .id(500L)
                .content("맛있게 밥 먹어요")
                .build();

        // 2. Chatroom 생성시 post 객체 이용
        ChatRoom chatRoom1 = ChatRoom.builder()
                .id(1L)
                .post(mockPost)
                .createdAt(LocalDateTime.now())
                .build();

        given(chatRoomRepository.findAllByMember(member)).willReturn(List.of(chatRoom1));

        // when
        List<ChatRoomResponse> responses = chatService.getMyChatRooms(member);

        // then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getPostContent()).isEqualTo("맛있게 밥 먹어요");
    }

    @Test
    @DisplayName("채팅 메시지 내역 조회 성공 - 모든 연관 관계 포함")
    void getChatMessages_Success() {
        Post mockPost = Post.builder()
                .id(500L)
                .content("게시글 내용")
                .build();

        ChatRoom mockChatRoom = ChatRoom.builder()
                .id(100L)
                .post(mockPost)
                .createdAt(LocalDateTime.now())
                .build();

        Member sender = Member.builder()
                .id(1L)
                .build();

        given(chatRoomRepository.findById(100L)).willReturn(Optional.of(mockChatRoom));
        given(chatRoomMemberRepository.existsByChatRoomAndMember(mockChatRoom, member)).willReturn(true);

        ChatMessage msg1 = ChatMessage.builder()
                .id(1L)
                .content("첫 번째 메시지")
                .chatRoom(mockChatRoom)
                .sender(sender)
                .sentAt(LocalDateTime.now().minusMinutes(2))
                .build();

        ChatMessage msg2 = ChatMessage.builder()
                .id(2L)
                .content("두 번째 메시지")
                .chatRoom(mockChatRoom)
                .sender(sender)
                .sentAt(LocalDateTime.now().minusMinutes(1))
                .build();

        given(chatMessageRepository.findAllByChatRoomOrderBySentAtAsc(mockChatRoom))
                .willReturn(List.of(msg1, msg2));

        // when
        List<ChatMessageResponse> responses = chatService.getChatMessages(member, 100L);

        // then
        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getContent()).isEqualTo("첫 번째 메시지");
        assertThat(responses.get(1).getContent()).isEqualTo("두 번째 메시지");

        // Repository 호출 횟수 검증
        verify(chatRoomRepository, times(1)).findById(100L);
        verify(chatMessageRepository, times(1)).findAllByChatRoomOrderBySentAtAsc(mockChatRoom);
    }
}
