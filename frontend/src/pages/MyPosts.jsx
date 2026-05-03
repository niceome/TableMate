import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FoodIcon } from "../components/FoodIcons";

// 시연용 mock — 백엔드 연동 시 GET /api/posts?authorId=me 로 교체
const mockAllPosts = [
  { id: 1, authorId: 1, foodType: "WESTERN",  title: "Chicken party!",        time: "12:00", location: "Student Union Food Court", current: 2, max: 4, status: "OPEN",   pendingCount: 1 },
  { id: 2, authorId: 1, foodType: "WESTERN",  title: "누구 피자 먹을 사람?",     time: "12:30", location: "Campus Pizza House",       current: 1, max: 3, status: "OPEN",   pendingCount: 2 },
  { id: 3, authorId: 3, foodType: "KOREAN",   title: "Korean BBQ 같이 가요",    time: "13:00", location: "천지관",                   current: 3, max: 4, status: "OPEN",   pendingCount: 0 },
  { id: 4, authorId: 4, foodType: "JAPANESE", title: "스시 먹고 싶은 사람!",     time: "11:30", location: "백록관",                   current: 1, max: 3, status: "CLOSED", pendingCount: 0 },
  { id: 5, authorId: 2, foodType: "CHINESE",  title: "오늘 점심 라멘 어때요 :)", time: "12:00", location: "크누테리아",                current: 2, max: 4, status: "OPEN",   pendingCount: 1 },
];

function to12h(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function MyPosts() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myPosts = mockAllPosts.filter(p => p.authorId === user.id);

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#fff", paddingBottom: 100 }}>
      {/* 헤더 */}
      <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>내 게시글</h1>
        <p style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
          총 {myPosts.length}개의 게시글
        </p>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {myPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#bbb" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 12 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p style={{ fontSize: 14 }}>작성한 게시글이 없어요</p>
            <button
              onClick={() => navigate("/create")}
              style={{
                marginTop: 16, padding: "10px 20px", borderRadius: 20,
                backgroundColor: "#111", color: "#fff",
                fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer",
              }}
            >
              게시글 작성하기
            </button>
          </div>
        ) : (
          myPosts.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              style={{
                padding: "16px",
                borderRadius: 16,
                boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
                marginBottom: 12,
                cursor: "pointer",
                backgroundColor: "#fff",
                borderLeft: `3.5px solid ${post.status === "OPEN" ? "#4ade80" : "#f87171"}`,
              }}
            >
              {/* 상단: 아이콘 + 제목 + 상태배지 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <FoodIcon type={post.foodType} size={22} />
                </div>
                <span style={{
                  fontSize: 15, fontWeight: 600, color: "#111",
                  flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {post.title}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 500, flexShrink: 0,
                  padding: "3px 10px", borderRadius: 20,
                  backgroundColor: post.status === "OPEN" ? "#f0fdf4" : "#fff1f1",
                  color: post.status === "OPEN" ? "#16a34a" : "#dc2626",
                }}>
                  {post.status === "OPEN" ? "모집중" : "마감"}
                </span>
              </div>

              {/* 하단: 메타 정보 + 신청 현황 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#555" }}>
                    <IconClock />
                    <span>{to12h(post.time)}</span>
                    <span style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 3 }}>
                      <IconPeople />
                      {post.current}/{post.max}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#555" }}>
                    <IconPin />
                    <span>{post.location}</span>
                  </div>
                </div>

                {/* 신청 대기 뱃지 */}
                {post.pendingCount > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 20,
                    backgroundColor: "#fff7ed",
                    border: "1px solid #fed7aa",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      backgroundColor: "#f97316", display: "inline-block",
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#ea580c" }}>
                      신청 {post.pendingCount}명 대기중
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPosts;
