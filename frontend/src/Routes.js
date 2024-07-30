import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./JS/Page/Login.js";
import Home from "./JS/Page/Home.js";
import Mypage from "./JS/Page/Mypage.js";
import EditProfile from "./JS/Page/EditProfile.js";
import NotFound from "./JS/Page/NotFound.js";
import Ranking from "./JS/Page/Ranking.js";

class AppRoutes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    );
  }
}

export default AppRoutes;
