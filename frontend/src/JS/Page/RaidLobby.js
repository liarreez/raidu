import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Modal, Hidden } from "@mui/material";
import axios from "axios";

import FadeAnime from "../Component/FadeAnime";
import SpringAnime from "../Component/SpringAnime";
import "../../CSS/RaidLobby.css";
import TopNav from "../Component/TopNav";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

import icon_exercise from "../../Imgs/icon_exercise.png";
import icon_breaktime from "../../Imgs/icon_breaktime.png";
import icon_counter from "../../Imgs/icon_counter.png";
import icon_human_fill from "../../Imgs/icon_human_fill.png";
import icon_human_empty from "../../Imgs/icon_human_empty.png";
import room from "../../Imgs/room.gif";

import raidu from "../../Imgs/button-raidu.png";

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
  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="lobby-modal-frame">
        <div className="icon-circle" style={{ position: "relative", top: "-50px" }}>
          <img src={room} alt="?"></img>
        </div>

        <div style={{ position: "relative", top: "-30px" }} className="lobby-modal-content">
          <div className="lobby-modal-title">방 만들기</div>

          <form onSubmit={handleSubmit}>
            <div className="lobby-modal-section">
              <label htmlFor="title">방 제목</label>
              <input type="text" id="title" name="title" value={title} onChange={handleChange} />
            </div>

            <div className="lobby-modal-section">
              <label htmlFor="maxParticipants">인원</label>
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

            <div className="lobby-modal-section">
              <label htmlFor="roundTime">라운드별 시간 (초)</label>
              <select id="roundTime" name="roundTime" value={roundTime} onChange={handleChange}>
                <option value="">30 ~ 180초 선택</option>
                {[...Array(6).keys()].map((i) => (
                  <option key={i} value={(i + 1) * 30}>
                    {(i + 1) * 30}
                  </option>
                ))}
              </select>
            </div>

            <div className="lobby-modal-section">
              <label htmlFor="restTime">휴식 시간 (초)</label>

              <select id="restTime" name="restTime" value={restTime} onChange={handleChange}>
                <option value="">30 ~ 180초 선택</option>
                {[...Array(6).keys()].map((i) => (
                  <option key={i} value={(i + 1) * 30}>
                    {(i + 1) * 30}
                  </option>
                ))}
              </select>
            </div>

            <div className="lobby-modal-section">
              <label htmlFor="totalRounds">라운드 수</label>
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

            <div className="lobby-modal-section">
              <label htmlFor="isPublic">비밀방 여부</label>
              <input type="checkbox" id="isPublic" name="isPublic" onChange={handleChange} />
            </div>

            <div className="lobby-modal-buttongroup">
              <button type="button" onClick={clearVals} className="lobby-modal-button-cancel">
                취소
              </button>
              <button type="submit" className="lobby-modal-button-submit">만들기</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

// 여기부터 로비 렌더링
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
      .then((res) => {
        res.status === 204 ? setRoomList([]) : setRoomList(res.data.data.waitingRoomList)
      })
      .catch((error) => {
        console.error("방 정보 받아오기 실패!", error);

        if (error.response.data.message === "액세스 토큰이 만료되었습니다!") {
          alert("토큰 만료! 다시 로그인 해주세요.");
          navigate("/login");
        }
      });

    axios
      .get(SERVER_URL + "/api/raidu/userpage", {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
        },
      })
      .then((res) => setMe(res.data.data.userProfile))
      .catch((error) => {
        console.error("유저 정보 가져오기 실패!", error);
        if (error.response.data.message === "액세스 토큰이 만료되었습니다!") {
          alert("토큰 만료! 다시 로그인 해주세요.");
          navigate("/login");
        }
      });
  }, []);

  const navigate = useNavigate();

  const changeLocation = (e, id, maxParticipants) => {
      return axios
    .get(SERVER_URL + "/api/raidu/rooms/" + id, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const guestInfo = res.data.data.guestList;
      const participants = guestInfo.length;
      maxParticipants - 1 === participants 
      ? 
      console.log('입장 금지 삐빅 == 여기에 입장 금지 로직 넣어주심 됩니다') 
      : 
      navigate("/raid/" + id);
    });
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
    if (name === "title")
      if (value.length <= 20) {
        setTitle(value);
      } else {
        alert("방 제목이 20자를 넘어서는 안됩니다!");
      }
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

    // 필수 항목 체크
    if (!title || !maxParticipants || !roundTime || !restTime || !totalRounds) {
      alert("모든 필수 항목을 입력해주세요!");
      return; // 조건을 충족하지 않으면 폼 제출 중지
    }
    if (title.length > 20) {
      alert("방 제목이 20자를 넘어서는 안됩니다!")
      return;
    }

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
        <div className="lobby-page-wrapper">
          <div className="top-nav">
            <TopNav />
          </div>

          <div className="lobby-content-wrapper">
            <SpringAnime from="down">
              <div className="lobby-content">
                {/* 방 리스트 */}
                <div className="lobby-list-wrapper">

                  {
                    // 대기방에 표시할 방이 없다면 노출됨 
                    roomList.length === 0 &&
                    <div className="lobby-list-empty">
                      <span>게임을 진행 중인 방이 없어요.</span>
                    </div>
                  }

                  {roomList.map((each, index) => (
                    <div className="lobby-list-card" key={index}>
                      {/* <Typography
                        key={index}
                        onClick={(e) => changeLocation(e, each.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {each.title}
                      </Typography> */}
                      <div className="lobby-card-number">{each.id}</div>
                      <div style={{ width: "100%" }}>
                        <div className="lobby-card-title">{each.title}</div>
                        <div className="lobby-card-icon-wrapper">
                          <div className="lobby-card-icon">
                            <p>휴식 시간</p>
                            <img alt="휴식 아이콘" src={icon_breaktime}></img>
                            <p>{each.restTime}</p>
                          </div>
                          <div className="lobby-card-icon">
                            <p>운동 시간</p>
                            <img alt="운동 아이콘" src={icon_exercise}></img>
                            <p>{each.roundTime}</p>
                          </div>
                          <div className="lobby-card-icon">
                            <p>라운드 수</p>
                            <img alt="라운드 아이콘" src={icon_counter}></img>
                            <p>{each.totalRounds}</p>
                          </div>
                          <div className="lobby-card-icon" style={{ width: "140px" }}>
                            <p>최대 인원</p>
                            <div className="lobby-card-pop">
                              {[...Array(each.maxParticipants)].map((_, i) => (
                                <img key={i} alt="인원 아이콘" src={icon_human_fill}></img>
                              ))}
                            </div>
                            <p>{each.maxParticipants}</p>
                          </div>
                          <div>
                            <button
                              className="lobby-join-button"
                              onClick={(e) => changeLocation(e, each.id, each.maxParticipants)}
                            >
                              <span className="text">입장하기</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 방 만들기 버튼 */}
                <div className="lobby-content-right">
                  <div className="lobby-make-button" onClick={openModal}>
                    <h3>방 만들기</h3>
                    <img src={raidu} alt="방 만들기" />
                  </div>

                  <div className="lobby-illust">
                    <img alt="로비 일러스트"></img>
                  </div>
                </div>
              </div>
            </SpringAnime>
          </div>
        </div>

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
