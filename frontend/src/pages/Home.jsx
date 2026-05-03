import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodIcon } from "../components/FoodIcons";

// time: "HH:MM" (24h), status: "OPEN" | "CLOSED" (백엔드 PostStatus enum)
const mockPosts = [
  { id: 1, foodType: "WESTERN",  title: "Chicken party!",        authorName: "Minjun K.", time: "12:00", cafeteria: null,       location: "Student Union Food Court", current: 2, max: 4, status: "OPEN"   },
  { id: 2, foodType: "WESTERN",  title: "누구 피자 먹을 사람?",     authorName: "Yuna P.",   time: "12:30", cafeteria: null,       location: "Campus Pizza House",       current: 1, max: 3, status: "CLOSED" },
  { id: 3, foodType: "KOREAN",   title: "Korean BBQ 같이 가요",    authorName: "Jihoon L.", time: "13:00", cafeteria: "CHEONJI",  location: "천지관",                   current: 3, max: 4, status: "OPEN"   },
  { id: 4, foodType: "JAPANESE", title: "스시 먹고 싶은 사람!",     authorName: "Hana C.",   time: "11:30", cafeteria: "BAENGNO",  location: "백록관",                   current: 1, max: 3, status: "OPEN"   },
  { id: 5, foodType: "CHINESE",  title: "오늘 점심 라멘 어때요 :)", authorName: "Seojin K.", time: "12:00", cafeteria: "KNUTERIA", location: "크누테리아",                current: 2, max: 4, status: "CLOSED" },
];

const CAFETERIA_FILTERS = [
  { value: "CHEONJI",  label: "천지관" },
  { value: "BAENGNO",  label: "백록관" },
  { value: "KNUTERIA", label: "크누테리아" },
  { value: "OTHER",    label: "기타" },
];

const FOOD_FILTERS = [
  { value: "KOREAN",   label: "한식" },
  { value: "JAPANESE", label: "일식" },
  { value: "CHINESE",  label: "중식" },
  { value: "WESTERN",  label: "양식" },
];

const TIME_FILTERS = ["11:00", "11:30", "12:00", "12:30", "13:00"];

const CAFETERIA_SET = new Set(["CHEONJI", "BAENGNO", "KNUTERIA"]);

function to12h(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 13px",
        borderRadius: 20,
        border: `1.5px solid ${active ? "#111" : "#ddd"}`,
        backgroundColor: active ? "#111" : "#fff",
        color: active ? "#fff" : "#555",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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

function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();
  const [filterCafeteria, setFilterCafeteria] = useState(null);
  const [filterFood, setFilterFood]           = useState(null);
  const [filterTime, setFilterTime]           = useState(null);

  function toggle(current, setValue, value) {
    setValue(current === value ? null : value);
  }

  const filteredPosts = mockPosts.filter(post => {
    if (filterCafeteria) {
      if (filterCafeteria === "OTHER") {
        if (post.cafeteria && CAFETERIA_SET.has(post.cafeteria)) return false;
      } else {
        if (post.cafeteria !== filterCafeteria) return false;
      }
    }
    if (filterFood && post.foodType !== filterFood) return false;
    if (filterTime && post.time !== filterTime) return false;
    return true;
  });

  return (
    <div style={{ padding: "24px 16px 100px", minHeight: "100svh", backgroundColor: "#fff" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>TableMate</h1>
        <p style={{ fontSize: 14, color: "#888", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
          Find your lunch buddy
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/>
          </svg>
        </p>
      </div>

      {/* 필터 */}
      <div style={{
        backgroundColor: "#f9f9f9",
        borderRadius: 16,
        padding: "14px 16px",
        marginBottom: 20,
        border: "1px solid #f0f0f0",
      }}>
        {/* 식당 */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 8 }}>식당</span>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {CAFETERIA_FILTERS.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={filterCafeteria === value}
                onClick={() => toggle(filterCafeteria, setFilterCafeteria, value)}
              />
            ))}
          </div>
        </div>

        {/* 음식 */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 8 }}>음식</span>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {FOOD_FILTERS.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={filterFood === value}
                onClick={() => toggle(filterFood, setFilterFood, value)}
              />
            ))}
          </div>
        </div>

        {/* 시간 */}
        <div>
          <span style={{ fontSize: 12, color: "#999", display: "block", marginBottom: 8 }}>시간</span>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {TIME_FILTERS.map(time => (
              <FilterChip
                key={time}
                label={time}
                active={filterTime === time}
                onClick={() => toggle(filterTime, setFilterTime, time)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", fontSize: 14 }}>
          조건에 맞는 모임이 없어요
        </div>
      ) : (
        filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
              marginBottom: 12,
              cursor: "pointer",
              backgroundColor: "#fff",
              borderLeft: `3.5px solid ${post.status === "OPEN" ? "#4ade80" : "#f87171"}`,
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              backgroundColor: "#f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FoodIcon type={post.foodType} size={26} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 상단: 제목 + 상태 배지 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{
                  fontSize: 15, fontWeight: 600, color: "#111",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  flex: 1, marginRight: 8,
                }}>
                  {post.title}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 500, flexShrink: 0,
                  padding: "3px 8px", borderRadius: 20,
                  backgroundColor: post.status === "OPEN" ? "#f0fdf4" : "#fff1f1",
                  color: post.status === "OPEN" ? "#16a34a" : "#dc2626",
                }}>
                  {post.status === "OPEN" ? "모집중" : "마감"}
                </span>
              </div>

              {/* 중단: 시간 + 인원 */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#555", marginBottom: 3 }}>
                <IconClock />
                <span>{to12h(post.time)}</span>
                <span style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <IconPeople />
                  {post.current}/{post.max}
                </span>
              </div>

              {/* 하단: 위치 + 작성자 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#555" }}>
                  <IconPin />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.location}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#bbb", flexShrink: 0, marginLeft: 8 }}>
                  {post.authorName}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/create")}
        style={{
          position: "fixed", bottom: 24, right: "calc(50% - 215px + 16px)",
          width: 52, height: 52,
          borderRadius: "50%",
          backgroundColor: "#111",
          color: "#fff",
          fontSize: 26, lineHeight: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        }}
      >
        +
      </button>
    </div>
  );
}

export default Home;
