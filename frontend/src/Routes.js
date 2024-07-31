import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./JS/Page/Login.js";
import Home from "./JS/Page/Home.js";
import Mypage from "./JS/Page/Mypage.js";
import EditProfile from "./JS/Page/EditProfile.js";
import NotFound from "./JS/Page/NotFound.js";
import UserSearch from "./JS/Page/UserSearch.js";

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/mypage" component={Mypage} />
          <Route path="/editprofile" component={EditProfile} />
          <Route path="/usersearch" component={UserSearch}/>

          <Route path="*" component={NotFound} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default Routes;
