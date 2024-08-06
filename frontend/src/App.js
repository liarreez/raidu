import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./JS/Page/Login.js";
import HomePage from "./JS/Page/Home.js";
import MyPage from "./JS/Page/Mypage.js";
import EditProfile from "./JS/Page/EditProfile.js";
import UserSearch from "./JS/Page/UserSearch.js";
import NotFound from "./JS/Page/NotFound.js";
import FirstVisit from "./JS/Page/FirstVisit.js";
import ConceptBook from "./JS/Page/ConceptBook.js";

import WaitRoom from "./JS/Page/WaitRoom.js";
import RaidLobby from "./JS/Page/RaidLobby.js";
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
            {/* 프로필 수정 경로 */}
            <Route path="/editprofile" element={<EditProfile />} />
            {/* 랭킹 경로 */}
            <Route path="/usersearch" element={<UserSearch />} />
            {/* 첫방문 -> 지역 / 닉네임 선택 */}
            <Route path="/firstvisit" element={<FirstVisit />} />
            {/* 첫방문 -> 지역 / 닉네임 선택 */}
            <Route path="/conceptbook" element={<ConceptBook />} />
            
            
            {/* 여기에 추가적인 경로를 설정할것 */}
            <Route path="/raid" element={<RaidLobby/>} />
            
            <Route path="/enter">
              <Route path=":roomNo" element ={<WaitRoom/>}/>
            </Route>
            {/* 예외처리 경로 - 와일드 카드 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AnimatePresence>
    </div>
  );
}

export default App;
