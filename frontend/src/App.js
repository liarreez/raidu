import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./JS/Page/Login.js";
import HomePage from "./JS/Page/Home.js";
import MyPage from "./JS/Page/Mypage.js"
// 다른 페이지들을 import 하세요

function App() {
  return (
    <div className="app">
      <AnimatePresence>
        <Router>
          <Routes>
            {/* 기본 경로를 /login으로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/login" />} />
            {/* 로그인 페이지 경로 */}
            <Route path="/login" element={<LoginPage />} />
            {/* 홈 페이지 경로 */}
            <Route path="/home" element={<HomePage />} />
            {/* 마이페이지 경로 */}
            <Route path="/mypage" element={<MyPage />} />
            {/* 여기에 추가적인 경로를 설정하세요 */}
            
          </Routes>
        </Router>
      </AnimatePresence>
    </div>
  );
}

export default App;
