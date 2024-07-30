import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./JS/Page/Login.js";
import Home from "./JS/Page/Home.js";
import Mypage from "./JS/Page/Mypage.js";
import EditProfile from "./JS/Page/EditProfile.js";
import NotFound from "./JS/Page/NotFound.js";
import Ranking from "./JS/Page/Ranking.js";

class Routes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/mypage" component={Mypage} />
            <Route path="/editprofile" component={EditProfile} />
            <Route path="/ranking" component={Ranking}/>

            <Route path="*" component={NotFound} />
          </Routes>
        </BrowserRouter>
    );
  }
}

export default Routes;