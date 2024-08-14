import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

// 대기방 고유 Id 생성 컴포넌트
import CreateWaitingRoom from "../Component/CreateWaitingRoom";

const BeforeTraining = () => {
  // 페이지 이동을 위한 네비게이션
  const navigate = useNavigate();
  const [waitingRoomId, setWaitingRoomId] = useState("");

  const goToTrainingRoom = () => {
    navigate("/exercise", {
      state: {
        // 여기에 대기방에서 설정한 내용들을 적어주시면 됩니다.
        roomId: waitingRoomId,
        test: 123,
      },
    });
  };

  return (
    <div>
      <CreateWaitingRoom setWaitingRoomId={setWaitingRoomId} />
      <button onClick={goToTrainingRoom}>운동방 출발!</button>
    </div>
  );
};

export default BeforeTraining;
