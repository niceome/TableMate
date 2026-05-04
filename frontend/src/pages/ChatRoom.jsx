import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FoodIcon } from "../components/FoodIcons";

const mockRooms = {
  1: {
    id: 1,
    postTitle: "Korean BBQ 같이 가요",
    foodType: "KOREAN",
    location: "천지관",
    members: [
      { id: 1, name: "Minjun K.", username: "minjun" },
      { id: 3, name: "Jihoon L.", username: "jihoon" },
    ],
  },
  2: {
    id: 2,
    postTitle: "스시 먹고 싶은 사람!",
    foodType: "JAPANESE",
    location: "백록관",
    members: [
      { id: 4, name: "Hana C.",  username: "hana" },
      { id: 2, name: "Yuna P.", username: "yuna" },
    ],
  },
};

const mockMessages = {
  1: [
    { id: 1, senderId: 1, senderName: "Minjun K.", content: "안녕하세요! 오늘 Korean BBQ 같이 가요~", sentAt: "12:10" },
    { id: 2, senderId: 3, senderName: "Jihoon L.", content: "네! 몇 시에 만날까요?", sentAt: "12:15" },
    { id: 3, senderId: 1, senderName: "Minjun K.", content: "12시에 천지관 앞에서 만나요!", sentAt: "12:20" },
  ],
  2: [
    { id: 1, senderId: 4, senderName: "Hana C.",  content: "스시 같이 먹어요!", sentAt: "11:00" },
    { id: 2, senderId: 2, senderName: "Yuna P.", content: "좋아요! 11시 30분에 봐요", sentAt: "11:10" },
  ],
};

function now() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function ChatRoom() {
  const { roomId } = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const room = mockRooms[roomId];
  const [messages, setMessages] = useState(mockMessages[roomId] ?? []);
  const [input, setInput]       = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!room) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
        채팅방을 찾을 수 없어요
      </div>
    );
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), senderId: user.id, senderName: user.name, content: text, sentAt: now() },
    ]);
    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100svh", backgroundColor: "#f5f5f5" }}>

      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", padding: 4, color: "#111", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>

        {/* 음식 아이콘 + 제목 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FoodIcon type={room.foodType} size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {room.postTitle}
            </p>
            <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{room.location}</p>
          </div>
        </div>

        {/* 참여자 토글 버튼 */}
        <button
          onClick={() => setShowMembers(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 10px", borderRadius: 20,
            backgroundColor: showMembers ? "#111" : "#f5f5f5",
            color: showMembers ? "#fff" : "#555",
            fontSize: 12, fontWeight: 500,
            border: "none", cursor: "pointer", flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {room.members.length}
        </button>
      </div>

      {/* 참여 인원 패널 */}
      <div style={{
        overflow: "hidden",
        maxHeight: showMembers ? 200 : 0,
        transition: "max-height 0.25s ease",
        backgroundColor: "#fff",
        borderBottom: showMembers ? "1px solid #f0f0f0" : "none",
        flexShrink: 0,
      }}>
        <div style={{ padding: "12px 16px" }}>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>참여 인원</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {room.members.map(member => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  backgroundColor: member.id === user.id ? "#111" : "#e8e8e8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  color: member.id === user.id ? "#fff" : "#555",
                }}>
                  {member.name[0]}
                </div>
                <span style={{ fontSize: 13, color: "#555" }}>
                  {member.name}
                  {member.id === user.id && <span style={{ color: "#aaa", marginLeft: 4 }}>(나)</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.id;
          const showName = !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}>
              {showName && (
                <span style={{ fontSize: 11, color: "#999", marginBottom: 3, marginLeft: 4 }}>
                  {msg.senderName}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flexDirection: isMe ? "row-reverse" : "row" }}>
                {/* 버블 */}
                <div style={{
                  maxWidth: "72%",
                  padding: "10px 14px",
                  borderRadius: isMe ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  backgroundColor: isMe ? "#111" : "#fff",
                  color: isMe ? "#fff" : "#111",
                  fontSize: 14, lineHeight: 1.5,
                  boxShadow: isMe ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  {msg.content}
                </div>
                {/* 시간 */}
                <span style={{ fontSize: 10, color: "#bbb", flexShrink: 0, paddingBottom: 2 }}>
                  {msg.sentAt}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        backgroundColor: "#fff",
        borderTop: "1px solid #f0f0f0",
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1, padding: "11px 16px",
            borderRadius: 24,
            border: "1.5px solid #e8e8e8",
            backgroundColor: "#fafafa",
            fontSize: 14, color: "#111",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            backgroundColor: input.trim() ? "#111" : "#e8e8e8",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: input.trim() ? "pointer" : "default",
            transition: "background 0.15s", flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

export default ChatRoom;
