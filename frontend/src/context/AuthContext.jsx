import { createContext, useContext, useState } from "react";

// 시연용 mock 유저 — 백엔드 연동 시 POST /api/auth/login 으로 교체
const MOCK_USERS = [
  { id: 1, username: "minjun",  password: "1234", name: "Minjun K.",  gender: "남", age: 22, foodPreferences: ["WESTERN"]          },
  { id: 2, username: "yuna",    password: "1234", name: "Yuna P.",    gender: "여", age: 21, foodPreferences: ["WESTERN", "KOREAN"] },
  { id: 3, username: "jihoon",  password: "1234", name: "Jihoon L.",  gender: "남", age: 23, foodPreferences: ["KOREAN"]            },
  { id: 4, username: "hana",    password: "1234", name: "Hana C.",    gender: "여", age: 22, foodPreferences: ["JAPANESE"]          },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tablemate_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(username, password) {
    const found = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (!found) return false;
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("tablemate_user", JSON.stringify(safeUser));
    return true;
  }

  function updateUser(updates) {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("tablemate_user", JSON.stringify(updated));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("tablemate_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
