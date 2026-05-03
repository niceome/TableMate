import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 식단표 URL — 연동 시 실제 URL로 교체
const MENU_URL = "https://www.knue.ac.kr/user/indexSub.do?codyMenuSeq=37&siteId=knue";

const ITEMS = [
  {
    label: "식단표",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="10" y2="14"/>
        <line x1="8" y1="18" x2="10" y2="18"/>
        <line x1="14" y1="14" x2="16" y2="14"/>
      </svg>
    ),
    onClick: () => window.open(MENU_URL, "_blank"),
  },
  {
    label: "마이페이지",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    path: "/mypage",
  },
  {
    label: "내 게시글",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    path: "/my-posts",
  },
  {
    label: "내 채팅방",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    path: "/chat",
  },
  {
    label: "글 작성",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    path: "/create",
  },
];

function SpeedDial() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleItem(item) {
    setOpen(false);
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  }

  return (
    <>
      {/* 백드롭 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)",
            zIndex: 40,
          }}
        />
      )}

      {/* 스피드 다이얼 */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: "max(16px, calc(50% - 199px))",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
        zIndex: 50,
      }}>
        {/* 서브 아이템 — index 0이 가장 위(멀), 마지막이 FAB 바로 위(가까움) */}
        {ITEMS.map((item, i) => {
          const delay = open ? `${(ITEMS.length - 1 - i) * 0.05}s` : "0s";
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0) scale(1)" : "translateY(14px) scale(0.85)",
                transition: `opacity 0.2s ease ${delay}, transform 0.2s ease ${delay}`,
                pointerEvents: open ? "auto" : "none",
              }}
            >
              {/* 라벨 */}
              <span style={{
                backgroundColor: "#111",
                color: "#fff",
                fontSize: 13, fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 20,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}>
                {item.label}
              </span>

              {/* 아이콘 버튼 */}
              <button
                onClick={() => handleItem(item)}
                style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "1.5px solid #e8e8e8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                  color: "#333",
                }}
              >
                {item.icon}
              </button>
            </div>
          );
        })}

        {/* 메인 FAB */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 52, height: 52,
            borderRadius: "50%",
            backgroundColor: "#111",
            color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </>
  );
}

export default SpeedDial;
