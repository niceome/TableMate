import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;