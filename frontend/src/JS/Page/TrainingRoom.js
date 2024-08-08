import React, { useState } from "react";
import { useLocation } from 'react-router-dom';

// 대기방 고유 Id 생성 컴포넌트
import CreateWaitingRoom from '../Component/CreateWaitingRoom';
// 운동방 참석 및 퇴장 가능한 컴포넌트
import TrainingRoomManager from '../Component/TrainingRoomManager';

// 현재 페이지는 대기방 고유 Id를 생성하고,
// 그걸 바탕으로 닉네임과 함께 방으로 들어가는 로직입니다.
// 나중에 수정 필요.
const TrainingRoom = () => {
  const location = useLocation();

  // 대기방 고유 Id
  // const [waitingRoomId, setWaitingRoomId] = useState('');
  // setWaitingRoomId(location.state.roomId)
  // const waitingRoomId = location.state.roomId;
  // const roomInfo = { ...location.state };

  // roomInfo = 대기방에서 받아온 정보들이 담긴 객체
  const roomData = { ...location.state }

  console.log(roomData);

  return (
    <div>
      {/* <CreateWaitingRoom setWaitingRoomId={setWaitingRoomId} /> */}
      <TrainingRoomManager roomData={roomData} />
    </div>
  );
};

export default TrainingRoom;
