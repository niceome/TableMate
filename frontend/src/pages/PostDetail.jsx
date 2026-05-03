import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FoodIcon } from "../components/FoodIcons";

// 시연용 mock — 백엔드 연동 시 GET /api/posts/:id 로 교체
const mockPost = {
  id: 2,
  authorId: 1,         // minjun 이 작성자
  foodType: "WESTERN",
  title: "누구 피자 먹을 사람?",
  authorName: "Minjun K.",
  time: "12:30",
  location: "Campus Pizza House",
  current: 1,
  max: 3,
  status: "OPEN",
  description: "Anyone want to grab a pizza? Thinking pepperoni or margherita!",
};

// 시연용 신청자 목록 — 백엔드 연동 시 GET /api/posts/:id/applicants 로 교체
const mockApplicants = [
  { applicationId: 1, applicantId: 2, name: "Yuna P.",   username: "yuna",   status: "PENDING"  },
  { applicationId: 2, applicantId: 3, name: "Jihoon L.", username: "jihoon", status: "ACCEPTED" },
  { applicationId: 3, applicantId: 4, name: "Hana C.",   username: "hana",   status: "REJECTED" },
];

function to12h(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

// ── 공통 아이콘 ──────────────────────────────────────────────
function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconMsg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

// ── 정보 카드 ────────────────────────────────────────────────
function InfoCard({ icon, label, value }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{value}</p>
    </div>
  );
}

// ── 신청자 바텀 시트 (작성자용) ──────────────────────────────
function ApplicantSheet({ open, onClose, applicants, onAccept, onReject }) {
  const statusStyle = {
    PENDING:  { bg: "#fff7ed", color: "#ea580c", label: "대기중"  },
    ACCEPTED: { bg: "#f0fdf4", color: "#16a34a", label: "수락됨"  },
    REJECTED: { bg: "#fff1f1", color: "#dc2626", label: "거절됨"  },
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 60 }}
        />
      )}
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: `translateX(-50%) translateY(${open ? "0" : "100%"})`,
        width: "100%", maxWidth: 430,
        backgroundColor: "#fff",
        borderRadius: "20px 20px 0 0",
        zIndex: 70,
        transition: "transform 0.3s ease",
        maxHeight: "70vh",
        overflowY: "auto",
      }}>
        {/* 핸들 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#e0e0e0" }} />
        </div>

        <div style={{ padding: "8px 16px 48px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 16 }}>
            신청자 목록 ({applicants.length}명)
          </h3>

          {applicants.length === 0 ? (
            <p style={{ textAlign: "center", color: "#bbb", fontSize: 14, padding: "24px 0" }}>
              아직 신청자가 없어요
            </p>
          ) : (
            applicants.map(app => {
              const s = statusStyle[app.status];
              return (
                <div key={app.applicationId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}>
                  {/* 아바타 + 이름 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      backgroundColor: "#111",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 700, color: "#fff",
                    }}>
                      {app.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: 0 }}>{app.name}</p>
                      <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>@{app.username}</p>
                    </div>
                  </div>

                  {/* 상태 or 수락/거절 버튼 */}
                  {app.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => onReject(app.applicationId)}
                        style={{
                          padding: "7px 14px", borderRadius: 20,
                          backgroundColor: "#f5f5f5", color: "#555",
                          fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
                        }}
                      >
                        거절
                      </button>
                      <button
                        onClick={() => onAccept(app.applicationId)}
                        style={{
                          padding: "7px 14px", borderRadius: 20,
                          backgroundColor: "#111", color: "#fff",
                          fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
                        }}
                      >
                        수락
                      </button>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      padding: "5px 10px", borderRadius: 20,
                      backgroundColor: s.bg, color: s.color,
                    }}>
                      {s.label}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// ── 작성자 액션 영역 ─────────────────────────────────────────
function AuthorActions({ post, applicants, onAccept, onReject }) {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pendingCount = applicants.filter(a => a.status === "PENDING").length;

  return (
    <>
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        padding: "12px 16px",
        backgroundColor: "#fff",
        borderTop: "1px solid #f0f0f0",
        display: "flex", gap: 10,
        zIndex: 10,
      }}>
        {/* 신청자 보기 */}
        <button
          onClick={() => setSheetOpen(true)}
          style={{
            flex: 1, padding: "15px",
            borderRadius: 14,
            backgroundColor: "#fff",
            border: "1.5px solid #e0e0e0",
            fontSize: 15, fontWeight: 600, color: "#111",
            cursor: "pointer",
            position: "relative",
          }}
        >
          신청자 보기
          {pendingCount > 0 && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              width: 18, height: 18, borderRadius: "50%",
              backgroundColor: "#ef4444", color: "#fff",
              fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {pendingCount}
            </span>
          )}
        </button>

        {/* 채팅방 보기 */}
        <button
          onClick={() => navigate("/chat")}
          style={{
            flex: 1, padding: "15px",
            borderRadius: 14,
            backgroundColor: "#111",
            fontSize: 15, fontWeight: 600, color: "#fff",
            cursor: "pointer", border: "none",
          }}
        >
          채팅방 보기
        </button>
      </div>

      <ApplicantSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        applicants={applicants}
        onAccept={onAccept}
        onReject={onReject}
      />
    </>
  );
}

// ── 참여자 액션 영역 ─────────────────────────────────────────
function GuestActions({ post, myStatus, onApply }) {
  const navigate = useNavigate();
  const isFull   = post.current >= post.max;
  const isClosed = post.status === "CLOSED";

  if (isFull || isClosed) {
    return (
      <FixedBar>
        <DisabledBtn>모집 마감</DisabledBtn>
      </FixedBar>
    );
  }

  if (myStatus === null) {
    return (
      <FixedBar>
        <button
          onClick={onApply}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            backgroundColor: "#111", color: "#fff",
            fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
          }}
        >
          Apply to Join 🙋
        </button>
      </FixedBar>
    );
  }

  if (myStatus === "PENDING") {
    return (
      <FixedBar>
        <DisabledBtn style={{ backgroundColor: "#f5f5f5", color: "#888" }}>
          신청 완료 · 수락 대기중
        </DisabledBtn>
      </FixedBar>
    );
  }

  if (myStatus === "ACCEPTED") {
    return (
      <FixedBar>
        <button
          onClick={() => navigate("/chat")}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            backgroundColor: "#16a34a", color: "#fff",
            fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
          }}
        >
          채팅방 입장 💬
        </button>
      </FixedBar>
    );
  }

  if (myStatus === "REJECTED") {
    return (
      <FixedBar>
        <DisabledBtn style={{ backgroundColor: "#fff1f1", color: "#dc2626" }}>
          신청이 거절되었습니다
        </DisabledBtn>
      </FixedBar>
    );
  }

  return null;
}

function FixedBar({ children }) {
  return (
    <div style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      padding: "12px 16px",
      backgroundColor: "#fff",
      borderTop: "1px solid #f0f0f0",
      zIndex: 10,
    }}>
      {children}
    </div>
  );
}

function DisabledBtn({ children, style = {} }) {
  return (
    <div style={{
      width: "100%", padding: "16px", borderRadius: 14,
      backgroundColor: "#e8e8e8", color: "#aaa",
      fontSize: 16, fontWeight: 600,
      textAlign: "center",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────
function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const post      = mockPost;
  const isAuthor  = post.authorId === user.id;

  // 작성자: 신청자 목록 상태
  const [applicants, setApplicants] = useState(mockApplicants);

  // 참여자: 내 신청 상태 (로그인한 유저가 이미 신청했는지 확인)
  const existingApp = mockApplicants.find(a => a.applicantId === user.id);
  const [myStatus, setMyStatus] = useState(existingApp?.status ?? null);

  function handleAccept(applicationId) {
    setApplicants(prev =>
      prev.map(a => a.applicationId === applicationId ? { ...a, status: "ACCEPTED" } : a)
    );
  }

  function handleReject(applicationId) {
    setApplicants(prev =>
      prev.map(a => a.applicationId === applicationId ? { ...a, status: "REJECTED" } : a)
    );
  }

  // 수락된 참여자 수
  const acceptedCount = applicants.filter(a => a.status === "ACCEPTED").length;
  const participantSlots = Array.from({ length: post.max }, (_, i) => i < acceptedCount + 1);

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100svh", paddingBottom: 88 }}>
      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, color: "#111", display: "flex" }}>
          <IconBack />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>Post Details</span>
      </div>

      <div style={{ padding: "16px" }}>
        {/* 음식 히어로 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 12,
          backgroundColor: "#fff", padding: "16px", borderRadius: 16,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 14,
            backgroundColor: "#f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FoodIcon type={post.foodType} size={36} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 4 }}>{post.title}</h2>
            <p style={{ fontSize: 13, color: "#888" }}>by {post.authorName}</p>
          </div>
          {/* 상태 배지 */}
          <span style={{
            fontSize: 11, fontWeight: 500, flexShrink: 0,
            padding: "4px 10px", borderRadius: 20,
            backgroundColor: post.status === "OPEN" ? "#f0fdf4" : "#fff1f1",
            color: post.status === "OPEN" ? "#16a34a" : "#dc2626",
          }}>
            {post.status === "OPEN" ? "모집중" : "마감"}
          </span>
        </div>

        {/* Time + Spots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <InfoCard icon={<IconClock />}  label="Time"     value={to12h(post.time)} />
          <InfoCard icon={<IconPeople />} label="Spots"    value={`${acceptedCount + 1}/${post.max}`} />
        </div>

        {/* Location */}
        <div style={{ marginBottom: 10 }}>
          <InfoCard icon={<IconPin />} label="Location" value={post.location} />
        </div>

        {/* About */}
        <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <IconMsg />
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>About this meal</h4>
          </div>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{post.description}</p>
        </div>

        {/* 참여자 */}
        <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>Participants</h4>
          <div style={{ display: "flex", gap: 10 }}>
            {participantSlots.map((confirmed, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: "50%",
                backgroundColor: confirmed ? "#111" : "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {confirmed ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ) : (
                  <span style={{ fontSize: 16, color: "#bbb", fontWeight: 500 }}>?</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 역할별 액션 */}
      {isAuthor ? (
        <AuthorActions
          post={post}
          applicants={applicants}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ) : (
        <GuestActions
          post={post}
          myStatus={myStatus}
          onApply={() => setMyStatus("PENDING")}
        />
      )}
    </div>
  );
}

export default PostDetail;
