import React from "react";
import { API_URL, ENV } from './config';
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
import RaidWaitRoom from "./JS/Page/RaidWaitRoom.js";

import TrainingRoom from './JS/Page/TrainingRoom.js';
import BeforeTraining from './JS/Page/BeforeTraining.js';
// 다른 페이지들을 import 하세요

function PrivateRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to="/login" />;
}

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
            <Route path="/home" element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />
            {/* 마이페이지 경로 */}
            <Route path="/mypage/:id" element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            } />
            {/* 프로필 수정 경로 */}
            <Route path="/editprofile" element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } />
            {/* 랭킹 경로 */}
            <Route path="/usersearch" element={
              <PrivateRoute>
                <UserSearch />
              </PrivateRoute>
            } />
            {/* 첫방문 -> 지역 / 닉네임 선택 */}
            <Route path="/firstvisit" element={
              <PrivateRoute>
                <FirstVisit />
              </PrivateRoute>
            } />
            {/* 첫방문 -> 지역 / 닉네임 선택 */}
            <Route path="/conceptbook" element={
              <PrivateRoute>
                <ConceptBook />
              </PrivateRoute>
            } />
            
            {/* 여기에 추가적인 경로를 설정할것 */}
            <Route path="/raid" element={
              <PrivateRoute>
                <RaidLobby />
              </PrivateRoute>
            } />
            <Route path="/raid/:roomName" element={
              <PrivateRoute>
                <RaidWaitRoom />
              </PrivateRoute>
            } />
            
            <Route path="/enter/:roomNo" element={
              <PrivateRoute>
                <WaitRoom />
              </PrivateRoute>
            } />

            {/* 테스트용 운동방 추가 */}
            <Route path="/trainingTest" element={
              <PrivateRoute>
                <TrainingRoom />
              </PrivateRoute>
            } />
            <Route path="/beforeTraining" element={
              <PrivateRoute>
                <BeforeTraining />
              </PrivateRoute>
            } />

            {/* 예외처리 경로 - 와일드 카드 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AnimatePresence>
    </div>
  );
}

export default App;
