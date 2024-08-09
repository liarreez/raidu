import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Modal } from "@mui/material";
import axios from "axios";

import FadeAnime from "../Component/FadeAnime";
import "../../CSS/RaidLobby.css";
import TopNav from "../Component/TopNav";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트


// Modal 렌더링을 분리
const RoomCreationModal = ({
    modalOpen,
    closeModal,
    handleSubmit,
    handleChange,
    clearVals,
    title,
    maxParticipants,
    roundTime,
    restTime,
    totalRounds,
    isPublic,
  }) => {
    const modalStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      border: "2px solid #000",
      borderRadius: "35px",
      boxShadow: 24,
      p: 4,
    };
  
    return (
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            방 만들기
          </Typography>
  
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">방 제목:</label>
              <input type="text" id="title" name="title" value={title} onChange={handleChange} />
            </div>
  
            <div>
              <label htmlFor="maxParticipants">인원:</label>
              <select
                id="maxParticipants"
                name="maxParticipants"
                value={maxParticipants}
                onChange={handleChange}
              >
                <option value="">1 ~ 4인 선택</option>
                <option value="1">1인</option>
                <option value="2">2인</option>
                <option value="3">3인</option>
                <option value="4">4인</option>
              </select>
            </div>
  
            <div>
              <label htmlFor="roundTime">라운드별 시간 (초):</label>
              <select id="roundTime" name="roundTime" value={roundTime} onChange={handleChange}>
                <option value="">15 ~ 180초 선택</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={(i + 1) * 15}>
                    {(i + 1) * 15}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label htmlFor="restTime">휴식 시간 (초):</label>
  
              <select id="restTime" name="restTime" value={restTime} onChange={handleChange}>
                <option value="">15 ~ 180초 선택</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={(i + 1) * 15}>
                    {(i + 1) * 15}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label htmlFor="totalRounds">라운드 수:</label>
              <select
                id="totalRounds"
                name="totalRounds"
                value={totalRounds}
                onChange={handleChange}
              >
                <option value="">1 ~ 3라운드 선택</option>
                <option value="1">1라운드</option>
                <option value="2">2라운드</option>
                <option value="3">3라운드</option>
              </select>
            </div>
  
            <div>
              <label htmlFor="isPublic">비밀방 여부:</label>
              <input type="checkbox" id="isPublic" name="isPublic" onChange={handleChange} />
            </div>
  
            <button type="button" onClick={clearVals}>
              취소
            </button>
            <button type="submit">만들기</button>
          </form>
        </Box>
      </Modal>
    );
  };

const RaidLobby = () => {
  const [roomList, setRoomList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [me, setMe] = useState(null);

  const SERVER_URL = API_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get(SERVER_URL + "/api/raidu/rooms", {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
        },
      })
      .then((res) => setRoomList(res.data.data.waitingRoomList))
      .then(
        axios
          .get(SERVER_URL + "/api/raidu/userpage", {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
            },
          })
          .then((res) => setMe(res.data.data.userProfile))
      );
  }, []);

  useEffect(() => {
    console.log(roomList);
    roomList.map((each) => {
      console.log(each.title);
    });
  }, [roomList]);

  const navigate = useNavigate();

  const changeLocation = (e, id) => {
    navigate("/raid/" + id);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // modal val
  const [title, setTitle] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [roundTime, setRoundTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    else if (name === "maxParticipants") setMaxParticipants(value);
    else if (name === "roundTime") setRoundTime(value);
    else if (name === "restTime") setRestTime(value);
    else if (name === "totalRounds") setTotalRounds(value);
    else if (name === "isPublic") {
      console.log(!e.target.checked);
      setIsPublic(!e.target.checked);
    }
  };

  const clearVals = () => {
    setMaxParticipants(0);
    setRoundTime(0);
    setRestTime(0);
    setTotalRounds(0);
    setIsPublic(true);
    setTitle("");
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      maxParticipants,
      roundTime,
      restTime,
      totalRounds,
      isPublic,
      hostEmail: me.email,
    };

    try {
      const response = await axios.post(SERVER_URL + "/api/raidu/rooms", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
        },
      });
      navigate("/raid/" + response.data.data.roomId, {
        state: {
          isCaptain: true,
        }, // 방을 만들고 들어가면 무조건 방장입니다.
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="raidLobby-html">
      <FadeAnime>
        <TopNav />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
            flexGrow: 1,
          }}
        >
          <div>
            <button onClick={openModal}>방 만들기</button>
          </div>
          <div>
            {roomList.map((each, index) => (
              <Typography key={index} onClick={(e) => changeLocation(e, each.id)} style={{ cursor: "pointer" }}>
                {each.title}
              </Typography>
            ))}
          </div>
          <Box sx={{ flex: 5, border: "2px dashed black" }}></Box>
        </Box>

        <RoomCreationModal
          modalOpen={modalOpen}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          clearVals={clearVals}
          title={title}
          maxParticipants={maxParticipants}
          roundTime={roundTime}
          restTime={restTime}
          totalRounds={totalRounds}
          isPublic={isPublic}
        />
      </FadeAnime>
    </div>
  );
};



export default RaidLobby;
