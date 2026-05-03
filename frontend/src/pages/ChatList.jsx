import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FoodIcon } from "../components/FoodIcons";

// 시연용 mock — 백엔드 연동 시 GET /api/chatrooms 로 교체
const mockChatRooms = [
  {
    id: 1,
    postTitle: "Korean BBQ 같이 가요",
    foodType: "KOREAN",
    location: "천지관",
    members: [
      { id: 1, name: "Minjun K.", username: "minjun" },
      { id: 3, name: "Jihoon L.", username: "jihoon" },
    ],
    lastMessage: "12시에 천지관 앞에서 만나요!",
    lastMessageTime: "12:20",
  },
  {
    id: 2,
    postTitle: "스시 먹고 싶은 사람!",
    foodType: "JAPANESE",
    location: "백록관",
    members: [
      { id: 4, name: "Hana C.",  username: "hana" },
      { id: 2, name: "Yuna P.", username: "yuna" },
    ],
    lastMessage: "좋아요! 11시 30분에 봐요",
    lastMessageTime: "11:10",
  },
];

function ChatList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myRooms = mockChatRooms.filter(room =>
    room.members.some(m => m.id === user.id)
  );

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#fff", paddingBottom: 100 }}>
      {/* 헤더 */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>내 채팅방</h1>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {myRooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#bbb" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p style={{ fontSize: 14 }}>참여 중인 채팅방이 없어요</p>
          </div>
        ) : (
          myRooms.map(room => (
            <div
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px",
                borderRadius: 16,
                boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
                marginBottom: 12,
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
            >
              {/* 음식 아이콘 */}
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                backgroundColor: "#f5f5f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <FoodIcon type={room.foodType} size={24} />
              </div>

              {/* 내용 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>
                    {room.postTitle}
                  </span>
                  <span style={{ fontSize: 11, color: "#bbb", flexShrink: 0 }}>{room.lastMessageTime}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                    {room.lastMessage}
                  </span>
                  {/* 참여 인원 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{room.members.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList;
