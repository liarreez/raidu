//=========== import libraries
import React, { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";

//=========== import networks
import { Socketest } from "../Component/Socketest.js";
import axios from "axios";

//=========== import essets
import "../../CSS/RaidWaitRoom.css";
import logo from "../../Imgs/logo.png";
import locked from "../../Imgs/lockedicon.png";
import unlocked from "../../Imgs/unlockedicon.png";
import out from "../../Imgs/roomouticon.png";

//=========== import components
import Participants from "../Component/RaidWaitRoom_participants.js";
import RoomInfoForm from "../Component/RaidWaitRoom_roominfoform.js";
import Chatting from "../Component/RaidWaitRoom_chatting.js";
import FadeAnime from "../Component/FadeAnime.js";
import SpringAnime from "../Component/SpringAnime.js";
import AnimatedNumber from "../Component/AnimatedNumber.js";

import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트
import { render } from "@testing-library/react";

class User {
  constructor(nickname, badge, profileImage, level, highestScore, readyState, isCaptain, email) {
    this.nickname = nickname; // 닉네임
    this.badge = badge; // 배지 PK
    this.profileImage = profileImage; // 프로필 이미지 src
    this.level = level; // 레벨
    this.highestScore = highestScore; // 최고기록
    this.readyState = readyState; // 레디 상태
    this.isCaptain = isCaptain; // 방장인가 아닌가
    this.email = email; // 사용자 이메일
  }
}
// 이하 웹소켓으로 세팅(지금은 dummy val)

class Room {
  constructor(roundTime, restTime, roundCount) {
    this.roundTime = roundTime;
    this.restTime = restTime;
    this.roundCount = roundCount;
  }
}

const SERVER_URL = API_URL;
const RaidWaitRoom = () => {
  // ========= roomName은 pathVariable로 줄 거고
  // ========= roomSet은 props로 넘기고
  // ========= isRoomLocked는 대기실에서 입장할 수 있는 모든 방이 false입니다
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [rendered, setRendered] = useState(false); // 초기화 확인

  const [webSocketReady, setWebSocketReady] = useState(0);

  // 페이지 이동을 위한 네비게이트
  const navigate = useNavigate();

  const { roomName } = useParams(); // 꼭 방의 제목일 필요 없다. PK 받아서 숫자로 지정할 것임
  const [roomSet, setRoomSet] = useState(new Room(0, 0, 0)); // roomSet은 객체임.
  // const [roomSet, setRoomSet] = useState()로 두게 되면 undefined 오류가 나므로
  // 초깃값을 임의의 어떤 값으로 채워주는 것이 좋다. DOM 로드 후 -> useEffect 실행되기 때문

  const [exerciseSet, setExerciseSet] = useState([]); // 이 부분은 하위 컴포 roominfoform에서만 세팅합니다.
  const exerciseSetRef = useRef([]);
  const [roomNamed, setRoomNamed] = useState("");
  const [isRoomLocked, setIsRoomLocked] = useState(false);

  // room setting은 방장만 바꿀 수 있으므로 유의하여 컴포에 props 넘길 것 ㅜ
  // room setting과 me.isCaptain을 컴포에 넘겨야 할 것 같음
  const [me, setMe] = useState(new User("", 0, "", 0, 0, false, false, ""));
  // 세션으로 받게 되면 세션 값으로 세팅해 주세요

  const [participantsList, setParticipantsList] = useState([]);

  // 방 제목 수정하는 방법
  // 상단 흰색 제목이 있는 영역을 클릭하면 수정할 수 있다.
  // 모달로 띄울지 아니면 동적으로 입력하도록 만들지(제목 지우고 input 넣고 버튼 띄우기)는 생각 중임
  // 아마 후자 될 것

  useEffect(() => {
    // 첫 번째 요청 : token 가져가서 user 정보 받아오기
    axios
      .get(SERVER_URL + "/api/raidu/userpage", {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const data = res.data.data.userProfile;
        console.log(data);
        setMe(
          (prevMe) => {
            console.log("이용자 정보 초기화");
            console.log(prevMe);
            const nu = new User(
              data.nickname,
              data.monsterBadgeUrl,
              data.profileImageUrl,
              data.level,
              data.bestScore,
              location.state !== null && location.state !== undefined, // 방장이면 readyState는 무조건 true
              location.state !== null && location.state !== undefined
                ? location.state.isCaptain
                : false,
              data.email
            );
            console.log(nu);
            return nu;
          }
          // me update 제대로 안 되는 문제 있음
        );

        // 두 번째 요청 : 받아온 user 정보의 이메일과 room PK 가지고 방 입장 처리하기
        if (location.state !== null && location.state !== undefined) {
          // 빈 Promise 반환(아래의 .then이 실행되도록 함)
          return Promise.resolve();
        } else {
          // location.state가 존재할 때만 실행
          return axios.post(
            SERVER_URL + "/api/raidu/rooms/" + roomName + "/" + data.email,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
              },
            }
          );
        }
      })
      .then((res) => {
        refreshParticipants();
      })
      .then((res) => {
        setRoomNamed(roomName); // 방 이름 변경 가능하게 하려면 이 부분 수정해야 함. 지금은 pathVal에서 가져온다
      })
      .catch((error) => {
        console.error("유저 정보 받아오기 실패!", error);
        if (error.response.data.message === "액세스 토큰이 만료되었습니다!") {
          alert("토큰 만료! 다시 로그인 해주세요.");
          navigate("/login");
        }
      });
  }, [token]); // onMount

  const refreshParticipants = () => {
    // 세 번째 요청 : 들어간 방의 정보와 기참가자 정보 리스트 받아오기

    // 방장이 퇴장했을 경우를 try-catch로 처리해야 함 (*room이 조회되지 않을 것이므로)
    return axios
      .get(SERVER_URL + "/api/raidu/rooms/" + roomName, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const roomInfo = res.data.data.room;
        const hostInfo = res.data.data.host;
        const guestInfo = res.data.data.guestList;
        setRoomNamed(roomInfo.title);
        setRoomSet(new Room(roomInfo.roundTime, roomInfo.restTime, roomInfo.totalRounds));
        setIsRoomLocked(!roomInfo.public);
        // console.log(roomInfo);
        // console.log("방장 정보 ==========");
        // console.log(hostInfo);
        // console.log("참가자 정보 ==========");
        // console.log(guestInfo);

        // 방장과 참가자 정보를 업데이트합니다.
        setParticipantsList(() => [
          new User(
            hostInfo.nickname,
            hostInfo.mosterBadgeUrl,
            hostInfo.profileImageUrl,
            hostInfo.level,
            hostInfo.bestScore,
            true,
            true,
            hostInfo.email
          ),
          ...guestInfo.map(
          (each) =>
            new User(
              each.nickname,
              each.monsterBadgeUrl,
              each.profileImageUrl,
              each.level,
              each.bestScore,
              false,
              false,
              each.email
            )
          ),
        ]);

        setMe((prevMe) => {
          return new User(
            prevMe.nickname,
            prevMe.badge,
            prevMe.profileImage,
            prevMe.level,
            prevMe.highestScore,
            false,
            prevMe.isCaptain,
            prevMe.email
          );
        });

        setRendered(true); // 로드 체크
      });
  };

  const roomSetSetter = (roundTime, restTime, roundCount) => {
    setRoomSet(new Room(roundTime, restTime, roundCount));
  };

  const exerciseSetSetter = (list) => {
    console.log(list);
    setExerciseSet((prevList) => {
      console.log(prevList);
      exerciseSetRef.current = list;
      return list;
    });
  };

  // 운동 set은 하위 컴포넌트에서 넘어와야 하는 값임
  // 레디를 눌렀을 때 disabled되며, 게임이 시작하면 서버로 넘어간다

  // WEBSOCKET SETTING ========================================

  const [websocketClient, setWebsocketClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // 페이지 진입 시 room PK를 가지고 소켓 클라이언트 객체를 생성합니다.
    const client = new Socketest(roomName);
    setWebsocketClient(client);
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [roomName]);

  useEffect(() => {
    // 소켓 클라이언트가 생성되면 서버 웹소켓과 연결합니다. /sub/message/ 구독을 시작합니다.
    if (!websocketClient) return;
    const connectWebSocket = async () => {
      try {
        await websocketClient.connect();
        const subscription = websocketClient.subscribe("/sub/message/" + roomName, (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log("====================");
          console.log(parsedMessage);
          console.log("====================");
          switch (parsedMessage.type) {
            case "1":
              parsedMessage.enterType
                ? refreshParticipants()
                : parsedMessage.isCaptain === true
                ? navigate("/raid")
                : refreshParticipants();
              break;
            case "2":
              updateUserReadyState(parsedMessage.user, parsedMessage.readyType);
              break;
            case "3":
              setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
              break;
            case "4":
              gameStart(parsedMessage.sessionId);
              break;
            default:
              console.log("UNKNOWN MESSAGE");
          }
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });

        setWebSocketReady(webSocketReady + 1);
        return () => {
          if (subscription) subscription.unsubscribe();
          websocketClient.disconnect();
        };
      } catch (error) {
        console.error("Error caused by websocket connecting process : ", error);
      }
    };
    connectWebSocket();

    return () => {
      if (websocketClient) {
        websocketClient.disconnect();
      }
    };
  }, [websocketClient, rendered, roomName]);

  // WATCHING USESTATES

  // useEffect(() => {
  //   console.log("participants updated ... ");
  //   console.log(participantsList);
  // }, [participantsList]);

  // useEffect(() => {
  //   console.log(me)
  // },[me])
  // useEffect(() => {
  //   console.log("rendering finished ... ");
  //   console.log(participantsList);
  //   console.log(me);

  //   //  rendered == true && sendTest1(true); // 내가 입장하면 다른 사람에게도 입장 알림 전송
  //   console.log("I sent entered alert");
  // }, [rendered]);

  useEffect(() => {
    // console.log(`webSocketReady value = ${webSocketReady}`);
    sendTest1(true);
    //    if(rendered === true && webSocketReady === 5) sendTest1(true)
    // webSocketReady가 1씩 증가하는 로직을 가지고 있고, 이 값이 1이어야 최초 초기화
  }, [websocketClient, webSocketReady, rendered]);

  // WEBSOCKET 동작 테스트 ===========================

  // making timestamp
  const getTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    // const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const DESTINATION = "/pub/message";
  const COMMONFORM = {
    // 메시지 타입 관계없이 공통적으로 쓰이는 내용입니다.
    user: me.nickname,
    channel: roomName,
    timestamp: getTime(),
  };

  const waitForWebSocketConnection = () => {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (websocketClient && websocketClient.isConnected) {
          resolve();
        } else {
          setTimeout(checkConnection, 1000); // 1초 후 재시도
        }
      };
      checkConnection();
    });
  };

  const sendTest1 = async (enterType) => {
    try {
      await waitForWebSocketConnection();
      const message = JSON.stringify({
        ...COMMONFORM,
        type: "1",
        enterType,
        isCaptain: me.isCaptain,
      });
      websocketClient.send(DESTINATION, message);
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const sendTest2 = (readyType) => {
    // 사용자 준비 상태 관련 웹소켓 메서드
    if (checkExerciseOption()) {
      if (websocketClient) {
        const message = JSON.stringify({
          ...COMMONFORM,
          type: "2",
          readyType,
        });
        websocketClient.send(DESTINATION, message);
      }
    } else {
      alert("모든 라운드에 대한 운동 종목 선택을 완료해 주세요.");
    }
  };

  const sendTest3 = (content) => {
    // 사용자 채팅 전송 관련 웹소켓 메서드
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: "3",
        body: content,
      });
      websocketClient.send(DESTINATION, message);
    }
  };

  const sendTest4 = (sessionId) => {
    // 방장이 게임 시작을 누르면 메시지 발송
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: "4",
        startType: true,
        sessionId,
      });
      websocketClient.send(DESTINATION, message);
    }
  };

  const exit = async () => {
    // 퇴장 메서드
    await axios
      .delete(SERVER_URL + "/api/raidu/rooms/" + roomName + "/" + me.email, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
        },
      })
      .then(() => {
        sendTest1(false);
      })
      .then(() => {
        navigate("/raid");
      });
  };

  // 레디부터 작업하기
  const updateUserReadyState = (name, readyType) => {
    // 함수형 업데이트를 사용하여 상태 업데이트
    console.log("before ready");
    console.log(participantsList);
    setParticipantsList((prevParticipantsList) => {
      const updatedParticipants = prevParticipantsList.map((user) => {
        if (user.nickname === name) {
          // 새 User 객체 생성
          return new User(
            user.nickname,
            user.badge,
            user.profileImage,
            user.level,
            user.highestScore,
            readyType,
            user.isCaptain,
            user.email
          );
        }
        return user;
      });

      console.log(updatedParticipants); // 업데이트된 참가자 목록을 로그로 출력

      // 상태 업데이트 후 추가 작업을 처리할 수 있습니다.
      return updatedParticipants; // 새 상태 반환
    });

    // `me` 상태를 업데이트
    console.log(name);
    console.log(me.nickname);
    console.log(me);
    if (name === me.nickname) {
      setMe((prevMe) => {
        console.log(prevMe);
        return new User(
          prevMe.nickname,
          prevMe.badge,
          prevMe.profileImage,
          prevMe.level,
          prevMe.highestScore,
          readyType,
          prevMe.isCaptain,
          prevMe.email
        );
      });
    }
  };

  const checkExerciseOption = () => {
    // '준비하기' 버튼을 누르기 전(1인 게임의 경우 '시작하기' 전) 모든 라운드의 운동 종류 선택이 완료되었는지 체크합니다.
    console.log("checkExerciseOption : " + exerciseSet.length);
    console.log("checkExerciseOption : " + roomSet.roundCount);
    return exerciseSet.length == roomSet.roundCount;
  };

  const checkReadyState = () => {
    if (checkExerciseOption()) {
      // 모든 사용자가 준비 상태인지, 모든 라운드별 운동 종목을 선택했는지 확인해 주세요
      if (participantsList.length != 1) {
        // 방에 남은 참가자가 한 명이면 레디 상태와 관련 없이 무조건 시작 가능합니다.
        const isAllReady = participantsList.every((user) => user.readyState);
        return isAllReady;
      } else return true;
    } else {
      alert("모든 라운드에 대한 운동 종목 선택을 완료해 주세요.");
      return false;
    }
  };

  const tryGameStart = () => {
    if (checkExerciseOption() === false) {
      alert("모든 라운드에 대한 운동 종목 선택을 완료해 주세요.");
    } else if (checkReadyState()) {
      console.log("============ PRINTING SETTINGS =============");
      // 방 정보
      // 사용자 정보
      // 선택한 운동 정보 묶어서 보여주기
      console.log(roomSet);
      console.log(me);
      console.log(exerciseSet);

      axios
        .post(
          SERVER_URL + "/api/raidu/rooms/sessions",
          { roomName },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Bearer 토큰을 사용하는 경우
            },
          }
        )
        .then((res) => {
          sendTest4(res.data.data.sessionId);
          // 웹소켓으로 모든 방 안의 참여자에게 게임 시작 알림을 보냅니다.
        });

      // 로딩스피너 보였으면 좋겠어용 ~
    } else {
      alert("아직 준비되지 않은 사용자가 있어요.");
    }
  };

  const gameStart = (sessionId) => {
    const roomInfo = roomSet;
    const userInfo = me;
    // const exerciseInfo = exerciseSet;
    const exerciseInfo = exerciseSetRef.current;

    console.log("=========TEST=========");
    console.log(roomInfo);
    console.log(userInfo);
    console.log(exerciseInfo);
    console.log(sessionId);

    navigate("/exercise", {
      // roomPk 주고 / userEmail 주고
      state: {
        roomId: sessionId,
        roomInfo,
        userInfo,
        exerciseInfo,
        roomPk: roomName,
      },
    });
  };

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        alert("운동방 주소가 클립보드에 복사되었습니다!");
      },
      (err) => {
        console.error("링크 복사에 실패했습니다: ", err);
      }
    );
  };
  // 0808 checkReadyState() 로직 제대로 작동하지 않아 확인 필요합니다.
  // 발생하고 있는 버그 : 모든 운동 라운드에 대한 종목 선택이 진행되지 않아도 게임이 시작되거나 준비가 진행됩니다.
  //

  // 여기서부터 작업반경... [정환]
  return (
    <FadeAnime>
      <div className="waitroom-page-wrapper">
        {/* 윗부분 */}
        <div className="waitroom-banner-top">
          <div onClick={() => navigate("/home")} className="waitroom-banner-logo">
            <img src={logo} alt="logoImg" />
          </div>
          <div className="waitroom-banner-info-wrapper">
            <div className="waitroom-banner-lock">
              <img
                src={isRoomLocked ? locked : unlocked}
                alt={isRoomLocked ? "locked" : "unlocked"}
              />
            </div>

            <div className="waitroom-banner-title">{roomNamed}</div>
            <div className="waitroom-banner-preset">
              ⏱ {roomSet.roundTime} / 💪 {roomSet.roundCount} / 💤 {roomSet.restTime}{" "}
            </div>
          </div>
        </div>
        {/* 윗부분 */}

        <div className="waitroom-content-wrapper">
          <SpringAnime from="down">
            <div className="waitroom-content">
              <div className="waitroom-content-left-wrapper">
                {/* 왼쪽 컨테이너 */}
                <div className="waitroom-left-user-wrapper">
                  {/* 참여자 슬롯 시작 */}
                  {participantsList.map((each, index) => (
                    <div className="waitroom-left-user-card" key={index}>
                      <div
                        className={`waitroom-card-number ${
                          each.readyState ? "waitroom-ready-number" : ""
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="waitroom-card-info-wrapper">
                        <div className="waitroom-card-info-nickname">{each.nickname}</div>

                        <div className="waitroom-card-info-content">
                          <div className="waitroom-card-icon-wrapper">
                            <div className="waitroom-card-icon">
                              <p>최고 점수</p>
                              <img alt="점수 아이콘"></img>
                              <p>{each.highestScore}</p>
                            </div>
                            <div className="waitroom-card-icon">
                              <p>레벨</p>
                              <img alt="레벨 아이콘"></img>
                              <p>{each.level}</p>
                            </div>

                            <div
                              className={`waitroom-ready-indicator ${
                                each.readyState ? "ready-indicator" : ""
                              }`}
                            >
                              {each.readyState ? "준비 완료" + " " + " ●" : "준비 대기" + " " + "●"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 참여자 슬롯 끝 */}
                <div>
                  {/* 채팅 슬롯 시작 */}
                  <div>
                    <Chatting
                      me={me}
                      roomName={roomName}
                      chatMessages={chatMessages}
                      sendTest3={sendTest3}
                    />
                  </div>
                  {/* 채팅 슬롯 끝 */}
                </div>
              </div>{" "}
              {/* 왼쪽 컨테이너 끝 */}
              {/* 오른쪽 컨테이너 시작*/}
              <div className="waitroom-content-right-wrapper">
                <div>
                  <div>
                    {/* 방정보 시작 */}
                    <div>
                      <RoomInfoForm
                        roomSet={roomSet}
                        roomSetSetter={roomSetSetter}
                        isCaptain={me.isCaptain}
                        rounds={roomSet.roundCount}
                        exerciseSetSetter={exerciseSetSetter}
                      />
                    </div>
                    {/* 방정보 끝 */}
                  </div>
                  <div className="waitroom-button-group">
                    {
                      // true 부분 onClick 구현 완료 시 수정 필요 !!
                      me.isCaptain ? (
                        <div className="raidWaitRoom-startButton" onClick={tryGameStart}>
                          <span className="raidWaitRoom-buttonText">시작하기</span>
                        </div>
                      ) : me.readyState ? (
                        <div className="raidWaitRoom-startButton" onClick={() => sendTest2(false)}>
                          <span className="raidWaitRoom-buttonText">준비 취소</span>
                        </div>
                      ) : (
                        <div className="raidWaitRoom-startButton" onClick={() => sendTest2(true)}>
                          <span className="raidWaitRoom-buttonText">준비하기</span>
                        </div>
                      )
                    }
                    {/* 공유, 나가기 */}
                    <div className="raidWaitRoom-shareButton" onClick={copyLink}>
                      <span className="raidWaitRoom-buttonText">링크 공유</span>
                    </div>
                    <div className="waitroom-button-leave" onClick={exit}>
                      <img src={out} alt="way out" className="raidWaitRoom-out" />
                    </div>
                    {/* 공유, 나가기 */}
                  </div>
                </div>
              </div>
              {/* 오른쪽 컨테이너 끝 */}
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default RaidWaitRoom;
