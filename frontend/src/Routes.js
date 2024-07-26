import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./JS/Page/Login.js";
import Home from "./JS/Page/Home.js";
import Mypage from "./JS/Page/Mypage.js";

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/mypage" component={Mypage} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default Routes;
