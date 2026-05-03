import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function IconUtensils() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/>
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        navigate("/", { replace: true });
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않아요.");
        setLoading(false);
      }
    }, 300);
  }

  const canSubmit = username.trim() && password.trim();

  return (
    <div style={{
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 24px 48px",
      backgroundColor: "#fff",
    }}>
      {/* 로고 */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            backgroundColor: "#111",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2"/>
              <path d="M7 2v20"/>
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/>
            </svg>
          </div>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.5, margin: 0 }}>
          TableMate
        </h1>
        <p style={{ fontSize: 14, color: "#aaa", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          Find your lunch buddy <IconUtensils />
        </p>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 아이디 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "13px 14px",
          borderRadius: 14,
          border: `1.5px solid ${error ? "#fca5a5" : "#e8e8e8"}`,
          backgroundColor: "#fafafa",
        }}>
          <IconUser />
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            placeholder="아이디"
            autoCapitalize="none"
            style={{
              flex: 1, fontSize: 15, color: "#111",
              backgroundColor: "transparent",
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "13px 14px",
          borderRadius: 14,
          border: `1.5px solid ${error ? "#fca5a5" : "#e8e8e8"}`,
          backgroundColor: "#fafafa",
        }}>
          <IconLock />
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            placeholder="비밀번호"
            style={{
              flex: 1, fontSize: 15, color: "#111",
              backgroundColor: "transparent",
            }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center", margin: 0 }}>
            {error}
          </p>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          style={{
            marginTop: 8,
            padding: "16px",
            borderRadius: 14,
            backgroundColor: canSubmit && !loading ? "#111" : "#ccc",
            color: "#fff",
            fontSize: 16, fontWeight: 600,
            cursor: canSubmit && !loading ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 시연용 안내 */}
      <div style={{
        marginTop: 32,
        padding: "12px 14px",
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
        fontSize: 12, color: "#999", lineHeight: 1.7,
      }}>
        <p style={{ margin: 0, fontWeight: 500, color: "#888", marginBottom: 4 }}>시연용 계정</p>
        <p style={{ margin: 0 }}>minjun / yuna / jihoon / hana</p>
        <p style={{ margin: 0 }}>공통 비밀번호: 1234</p>
      </div>
    </div>
  );
}

export default Login;
