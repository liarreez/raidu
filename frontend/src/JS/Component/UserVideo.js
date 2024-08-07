import React, { Component } from "react";
import OpenViduVideo from "../Component/OpenViduVideo";

import "../../CSS/UserVideo.css";

export default class UserVideo extends Component {
  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
  }

  render() {
    return (
      <div>
        {this.props.streamManager !== undefined ? (
          <div className="streamcomponent-user">
            <OpenViduVideo streamManager={this.props.streamManager} />
            <div className='user-name'>
              <p>{this.getNicknameTag()}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
