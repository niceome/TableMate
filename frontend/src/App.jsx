import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import MyPage from "./pages/MyPage";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import MyPosts from "./pages/MyPosts";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/post/:id"  element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
      <Route path="/create"    element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/mypage"      element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
      <Route path="/my-posts"    element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
      <Route path="/chat"        element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
      <Route path="/chat/:roomId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
