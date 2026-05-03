import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FOOD_TYPES } from "../components/FoodIcons";

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name:   user.name,
    gender: user.gender,
    age:    user.age,
  });
  const [foodPrefs, setFoodPrefs] = useState(user.foodPreferences ?? []);

  function toggleFood(value) {
    setFoodPrefs(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  }

  function handleSave() {
    updateUser({ ...form, age: Number(form.age), foodPreferences: foodPrefs });
    setEditMode(false);
  }

  function handleCancel() {
    setForm({ name: user.name, gender: user.gender, age: user.age });
    setFoodPrefs(user.foodPreferences ?? []);
    setEditMode(false);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initial = (user.name ?? "?")[0].toUpperCase();

  const inputStyle = {
    flex: 1,
    fontSize: 15,
    color: "#111",
    backgroundColor: editMode ? "#f9f9f9" : "transparent",
    border: editMode ? "1.5px solid #e8e8e8" : "none",
    borderRadius: 10,
    padding: editMode ? "6px 10px" : "0",
    outline: "none",
    fontFamily: "inherit",
    textAlign: "right",
  };

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#f5f5f5", paddingBottom: 100 }}>
      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, color: "#111", display: "flex" }}>
          <IconBack />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>마이페이지</span>
        <button
          onClick={handleLogout}
          style={{ fontSize: 13, color: "#ef4444", fontWeight: 500, padding: "4px 8px" }}
        >
          로그아웃
        </button>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* 프로필 아바타 */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "28px 16px",
          backgroundColor: "#fff", borderRadius: 20,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            backgroundColor: "#111",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#fff",
            marginBottom: 12,
          }}>
            {initial}
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: 0 }}>{user.name}</p>
          <p style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>@{user.username}</p>
        </div>

        {/* 정보 카드 */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" }}>
          {/* 편집 버튼 */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid #f5f5f5",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>기본 정보</span>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#888" }}
              >
                <IconEdit /> 편집
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleCancel} style={{ fontSize: 13, color: "#888" }}>취소</button>
                <button onClick={handleSave}   style={{ fontSize: 13, color: "#111", fontWeight: 600 }}>저장</button>
              </div>
            )}
          </div>

          {/* 이름 */}
          {[
            {
              label: "이름",
              content: editMode
                ? <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                : <span style={{ fontSize: 15, color: "#111" }}>{user.name}</span>,
            },
            {
              label: "성별",
              content: editMode
                ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    {["남", "여"].map(g => (
                      <button
                        key={g}
                        onClick={() => setForm(f => ({ ...f, gender: g }))}
                        style={{
                          padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                          backgroundColor: form.gender === g ? "#111" : "#f5f5f5",
                          color: form.gender === g ? "#fff" : "#555",
                          border: "none", cursor: "pointer",
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )
                : <span style={{ fontSize: 15, color: "#111" }}>{user.gender}</span>,
            },
            {
              label: "나이",
              content: editMode
                ? (
                  <input
                    type="number" min={1} max={99}
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    style={{ ...inputStyle, width: 60 }}
                  />
                )
                : <span style={{ fontSize: 15, color: "#111" }}>{user.age}세</span>,
            },
          ].map(({ label, content }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #f5f5f5",
            }}>
              <span style={{ fontSize: 14, color: "#888" }}>{label}</span>
              {content}
            </div>
          ))}
        </div>

        {/* 선호 음식 */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "16px" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 14 }}>선호하는 음식</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {FOOD_TYPES.map(({ value, label, Icon }) => {
              const active = foodPrefs.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => editMode && toggleFood(value)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "12px 6px", borderRadius: 14, gap: 6,
                    backgroundColor: active ? "#111" : "#fff",
                    border: `1.5px solid ${active ? "#111" : "#e0e0e0"}`,
                    cursor: editMode ? "pointer" : "default",
                    opacity: !editMode && !active ? 0.35 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <Icon color={active ? "#fff" : "#555"} size={24} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "#fff" : "#555" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          {!editMode && (
            <p style={{ fontSize: 12, color: "#bbb", marginTop: 10, textAlign: "center" }}>
              편집 버튼을 눌러 선호 음식을 변경할 수 있어요
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default MyPage;
