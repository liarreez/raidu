import React, { useState } from "react";
import axios from "axios";
import { API_URL } from '../../config';  // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

const APPLICATION_SERVER_URL = API_URL+'/api/raidu/rooms/sessions';

// setWaitingRoomId = 대기방 고유 Id 변경 함수
const CreateWaitingRoom = ({ setWaitingRoomId }) => {
  // 이 컴포넌트에서 사용하는 대기방 고유 Id
  const [waitingRoom, setWaitingRoom] = useState('');
  // 대기방 이름 저장하는 변수
  const [TrainingRoomName, setTrainingRoomName] = useState('');
  // 유효성 토큰 (로그인이 되었는가 // 나중에 다른 곳에서 받아와야 할 듯!)
  const token = localStorage.getItem('accessToken');


  // 대기방 고유 Id 생성 로직
  const createWaitingRoomId = async () => {
    try {
      const response = await axios.post(APPLICATION_SERVER_URL, {TrainingRoomName}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      const newwaitingRoom = response.data.data.sessionId;
      setWaitingRoom(newwaitingRoom);
      setWaitingRoomId(newwaitingRoom); 
    } catch (error) {
    //  console.error('대기방 만들기에 실패했습니다.', error);
      throw error;
    }
  };

  return (
    <div>
      <h1>대기방 생성하기</h1>
      <input
        type="text"
        placeholder="대기방 이름"
        value={TrainingRoomName}
        onChange={(e) => setTrainingRoomName(e.target.value)}
      />
      <button onClick={createWaitingRoomId}>대기방 생성</button>
      {waitingRoom && <p>대기방 ID: {waitingRoom}</p>}
    </div>
  );
};

export default CreateWaitingRoom;
