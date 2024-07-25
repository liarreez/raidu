import React from 'react';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';

import Home from './JS/Page/Home.js';

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/home" component={Home} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default Routes;