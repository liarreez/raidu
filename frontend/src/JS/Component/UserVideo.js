import React from "react";
import OpenViduVideo from "../Component/OpenViduVideo";
import "../../CSS/UserVideo.css";

const UserVideo = ({ streamManager, num }) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    console.log(num)
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent-user">
          <OpenViduVideo streamManager={streamManager} />
          <div className="user-name">
            <p>{getNicknameTag()}</p>
          </div>
          <div className="user-name">
            <p>{ num }</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideo;