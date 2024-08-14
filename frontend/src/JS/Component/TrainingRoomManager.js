import React, { useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "../Component/UserVideo";
import SelfVideo from "./SelfVideo";
import SelfRestVideo from "./SelfRestVideo";
import "../../CSS/TrainingRoomManager.css";
import TotalCombatPower from "./TotalCombatPower";
import FadeAnime from "../Component/FadeAnime";

import exerciseSoldier from "../../Imgs/exerciseSoldier.gif";
import restSoldier from "../../Imgs/restSoldier.gif";
import standSoldier from "../../Imgs/standSoldier.png";

import burgerking from "../../Imgs/burgerking.png";

import Timer from "./Timer";
import TimerRest from "./TimerRest";

import { Socketest } from "./Socketest";

import { Modal, Box, Paper } from "@mui/material";

import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트
//=======================이슬
import completeScroll from "../../Imgs/complete_scroll.png";

import { ProgressBar, Step } from "react-step-progress-bar";

import jumpingJack from "../../Imgs/jumpingJack.png"; // 운동 이미지 예시
import lunge from "../../Imgs/lunge.png";
import pushUp from "../../Imgs/pushUp.png";
import squat from "../../Imgs/squat.png";
import situp from "../../Imgs/situp.png";

import burgerking from "../../Imgs/burgerking.png";
import turtleneck from "../../Imgs/turtleneck.png";
import diabeticlizard from "../../Imgs/diabeticlizard.png";
import enteritisowl from "../../Imgs/enteritisowl.png";
import fatiguebat from "../../Imgs/fatiguebat.png";
import gloomylion from "../../Imgs/gloomylion.png";
import dryeyecrab from "../../Imgs/dryeyecrab.png";
import foodpoisoningwhale from "../../Imgs/foodpoisoningwhale.png";
import lowtemperaturewolf from "../../Imgs/lowtemperaturewolf.png";
import MigraineMedusa from "../../Imgs/MigraineMedusa.png";
import mountainsicknesseagle from "../../Imgs/mountainsicknesseagle.png";
import forgetfulduck from "../../Imgs/forgetfulduck.png";

// 운동명에 따른 이미지 매핑 객체
const exerciseImages = {
  jumpingJack: jumpingJack,
  lunge: lunge,
  pushUp: pushUp,
  squat: squat,
  sitUp: situp,
};

const exerciseName = {
  jumpingJack: "팔벌려뛰기",
  lunge: "런지",
  pushUp: "팔굽혀펴기",
  squat: "스쿼트",
  sitUp: "윗몸일으키기",
};

// 몬스터 명에 따른 이미지 매핑
const monsterImages = {
  "비마니우스 3세": burgerking,
  "거북목거북": turtleneck,
  "당뇨마뱀": diabeticlizard,
  "뿡엉이": enteritisowl,
  "피곤 박쥐": fatiguebat,
  "우울 사자": gloomylion,
  "건조하 게": dryeyecrab,
  "식중독 고래": foodpoisoningwhale,
  "춥개": lowtemperaturewolf,
  "메두통사": MigraineMedusa,
  "고산증 독수리": mountainsicknesseagle,
  "오?리?": forgetfulduck,
};

function StepProgressBar({ expPercentage }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (percent < expPercentage) {
        setPercent((prevPercent) => prevPercent + 1);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [percent, expPercentage]);

  return (
    <ProgressBar
      percent={percent}
      filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      unfilledBackground="#3E3A3A"
      width="500px"
      height="20px"
    >
      <Step transition="scale">{({ accomplished }) => <div />}</Step>
      <Step transition="scale">{({ accomplished }) => <div />}</Step>
    </ProgressBar>
  );
}

//=======================이슬

const APPLICATION_SERVER_URL = API_URL + "/api/raidu/rooms";

// roomData = 대기방에서 받아온 정보들이 담긴 객체
const TrainingRoomManager = ({ roomData }) => {
  const [isNewMonster, setIsNewMonster] = useState(false);
  const [monsterName, setMonsterName] = useState(null);
  // const [monsterImgUrl, setMonsterImgUrl] = useState(null);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [updatedExp, setUpdatedExp] = useState(0);
  const [updatedLevel, setUpdatedLevel] = useState(0);

  const [regionName, setRegionName] = useState(false);

  const [updatedExpPercentage, setUpdatedExpPercentage] = useState(0);
  const [updatedRegionScorePercentage, setUpdatedRegionScorePercentage] = useState(0);

  // 지역 기여도 업데이트 함수
  const UpdateRegionScore = (updatedRegionScore, totalContribute) => {
    setUpdatedRegionScorePercentage((prevPercent) => {
      const newPercentage = (updatedRegionScore / totalContribute) * 100;

      console.log("NEWPERCE#NTAGE    ", newPercentage);
      return newPercentage;
    });
  };

  // 운동방이 시작했는가? (joinTrainingRoom을 한번만 하기 위해 넣은 확인용)
  const [hasJoined, setHasJoined] = useState(false);

  // 대기방에서 운동방으로 넘어올 때 받은 정보들을 저장해준 후, 운동방을 자동 시작
  useEffect(() => {
    if (!hasJoined) {
      console.log("방 정보 및 라운드별 가중치 제대로 나오나요?!---------");
      console.log(roomData);
      console.log(roomData.roomPk);
      console.log(roundWeight);
      joinTrainingRoom();
      setHasJoined(true);
    }
  }, [hasJoined]);

  // waitingRoomId = 대기방 고유 Id
  const waitingRoomId = roomData.roomId;
  // 유저 닉네임
  const myUserName = roomData.userInfo.nickname;

  // 방장 유무
  const isCaptain = roomData.userInfo.isCaptain;

  const myUserEmail = roomData.userInfo.email;

  // 포즈가 감지 되었는가? (포즈 감지 후 버튼 활성화 예정)
  const [isPoseDetect, setIsPoseDetect] = useState(false);

  // 아래에서 포즈 감지가 되는지 확인을 위한 함수
  const changeIsPoseDetect = () => {
    setIsPoseDetect((prevstate) => {
      const newState = true;

      return true;
    });
  };

  // 타이머 시작 한번만 하기 위해서 만든 상태
  const [firstClick, setFirstClick] = useState(true);

  // 처음 버튼 클릭 시, 버튼 안보이게 하기
  const ClickEnd = () => {
    setFirstClick(false);
  };

  // 현재 어떤 단계인가 (세팅, 운동, 휴식, 정산으로 나뉠듯)
  // 기본 상태는 ready
  // setup, exercise, rest, ending
  const [currentStep, setCurrentStep] = useState("ready");
  // 정해둔 셋팅 시간(준비시간)
  const setupTime = 3;
  // 정해둔 운동시간
  const exerciseTime = roomData.roomInfo.roundTime;
  // 정해둔 쉬는시간
  const restTime = roomData.roomInfo.restTime;
  // 정해둔 라운드(운동 횟수)
  const roundCount = roomData.roomInfo.roundCount;
  // 라운드 별 운동 배열
  const exerciseForRound = roomData.exerciseInfo;

  const gainedExp = (exerciseTime / 60) * roundCount * 50;

  // 라운드 별 운동 가중치(운동에 따라 저장)
  const roundWeight = [];
  // 라운드 별 운동 횟수(count)
  // const eachRoundCount = [];
  const [eachRoundCount, setEachRoundCount] = useState([]);
  // 라운드 별 전투력(가중치 * 횟수)
  // const myCombatPower = [];
  const [myCombatPower, setMyCombatPower] = useState([]);
  // 자신의 전투력
  const [myTotalCombatPower, setMyTotalCombatPower] = useState(0);

  // 종료 시간 useState 저장
  const [endTime, setEndTime] = useState();

  // 종료 시간을 받아주는 함수
  const getEndTime = () => {
    setEndTime((prevTime) => {
      // 현재 시간 받아주기
      const nowDate = Date.now();
      // 한국 시간으로 로컬라이징 + 저장 포멧
      const newEndTime = new Date(nowDate + 9 * 60 * 60 * 1000).toISOString().slice(0, 19);

      console.log("-------------------시간---------------------");
      console.log(nowDate, endTime);

      return newEndTime;
    });
  };

  // API로 줄 roundRecordList 만들기
  const roundRecordList = [];

  // 다시 저장할 레코드 리스트
  const [finishRoundRecordList, setFinishRoundRecordList] = useState([]);

  // roundRecordList 가 잘 저장되었는지 확인해주는 boolean
  const [isRoundRecordListExist, setIsRoundRecordListExist] = useState(false);

  // EachRoundCount 배열이 다 저장되었는지 확인해주는 boolean
  const [isEachRoundCountExist, setIsEachRoundCountExist] = useState(false);

  // isRoundRecordListExist 가 바로 반영될 수 있도록 해주는 함수
  const ChangeStateOfRoundRecordListExist = () => {
    for (let i = 0; i < exerciseForRound.length; i++) {
      const roundRecord = {
        roundNumber: i + 1,
        dictionaryName: exerciseForRound[i],
        exerciseCount: eachRoundCount[i],
      };
      roundRecordList[i] = roundRecord;
    }

    console.log(endTime);
    console.log("제대로 된 레코드 리스트가 나오나요?");
    console.log(roundRecordList);

    setFinishRoundRecordList((prevList) => {
      const newRecord = roundRecordList;
      return newRecord;
    });

    setIsRoundRecordListExist((prevCheck) => {
      const nowState = true;
      return nowState;
    });
  };

  // eachRoundCount 배열이 다 완성되었는지 확인하는 useEffect
  useEffect(() => {
    if (eachRoundCount.length === roundCount) {
      setIsEachRoundCountExist((prevCheck) => {
        const nowState = true;
        return nowState;
      });
    }
  }, [eachRoundCount]);

  // isEachRoundCountExist 이 true면 ChangeStateOfRoundRecordListExist 실행
  useEffect(() => {
    if (isEachRoundCountExist === true) {
      ChangeStateOfRoundRecordListExist();
    }
  }, [isEachRoundCountExist]);

  // 자식 컴포넌트(selfVideo) 에서 라운드 별 운동 횟수 변경을 위해 함수 선언
  const updateEachRoundCount = (roundIndex, newCount) => {
    setEachRoundCount((prevState) => {
      console.log("라운드 카운트를 업데이트 해요");
      const updatedCounts = [...prevState];
      console.log(updatedCounts);
      if (roundIndex === 0) {
        updatedCounts[roundIndex] = newCount;
      } else {
        let prevCount = 0;
        for (let i = 0; i < roundIndex; i++) {
          prevCount = prevCount + updatedCounts[i];
        }
        updatedCounts[roundIndex] = newCount - prevCount;
      }
      return updatedCounts;
    });
  };

  // 자식 컴포넌트(selfVideo) 에서 라운드 별 전투력 변경을 위해 함수 선언
  const updateMyCombatPower = (nowRound, count, weight) => {
    console.log("라운드 전투력을 업데이트 해요");
    setMyCombatPower[nowRound - 1] = count * weight; // weight = roundWeight[(nowRound) - 1]
  };
  // const updateMyCombatPower = (roundIndex, newPower) => {
  //   setMyCombatPower(prevState => {
  //     const updatedPower = [...prevState];
  //     updatedPower[roundIndex] = newPower;
  //     return updatedPower;
  //   });
  // };

  // 자식 컴포넌트(selfVideo) 에서 자신의 전투력 변경을 위해 함수 선언
  // 가중치를 받아온다.
  const UpdateMyTotalCombatPower = (weight) => {
    setMyTotalCombatPower((prevPower) => {
      const updatePower = prevPower + weight;
      return updatePower;
    });
  };

  // 실험용(바로바로 누적되는 자신의 전투력)
  // let addMyCombatPower = 0;
  const [addMyCombatPower, setAddMyCombatPower] = useState(0);

  // useEffect(() => {
  //   addMyCombatPower = 0;
  //   myCombatPower.forEach(power => {
  //     addMyCombatPower = addMyCombatPower + power
  //   });
  // }, [myCombatPower])

  // 자식 컴포넌트(selfVideo) 에서 본인 누적 전투력 변경을 위해 함수 선언
  const ChangeAddMyCombatPower = (weigthPower) => {
    setAddMyCombatPower(addMyCombatPower + weigthPower);
  };

  // 전체 전투력(모두의 전투력이 들어갈 예정)
  const [totalCombatPower, setTotalCombatPower] = useState(0);

  // 전체 전투력 합산(웹소켓을 통해)
  const addCombatPower = (score) => {
    // console.log('기존 전투력');
    // console.log(totalCombatPower);
    setTotalCombatPower((prevTotal) => {
      const newTotal = prevTotal + score;
      // console.log('바뀐 전투력');
      // console.log(newTotal);
      return newTotal;
    });
  };

  // 프로그레스 바에 들어가는 전체 전투력 게이지
  const [totalCombatGauge, setTotalCombatGauge] = useState(0);
  // 프로그레스 바가 다 찰때마다 올라가는 레벨(단계)
  const [totalCombatLevel, setTotalCombatLevel] = useState(0);

  // 프로그레스 바 게이지와 레벨(단계)를 넣어주기 위한 내용
  useEffect(() => {
    const level = Math.floor(totalCombatPower / 750);
    const gauge = totalCombatPower % 750;
    setTotalCombatGauge(gauge);
    setTotalCombatLevel(level);
    // console.log(`잘 넣어집니당 ${gauge} ${totalCombatGauge} / ${level} ${totalCombatLevel}`);
  }, [totalCombatPower]);

  // const addMyCombatPower = (score, currentRound) => {
  //   myCombatPower[currentRound] += score;
  // }

  // 운동별 가중치(운동 종목 : 가중치)
  const exerciseScore = {
    jumpingJack: 20,
    lunge: 50,
    sitUp: 40,
    pushUp: 60,
    squat: 50,
  };

  // 운동 가중치에 따라 라운드 별 운동 가중치 설정
  for (let i = 0; i < exerciseForRound.length; i++) {
    roundWeight[i] = exerciseScore[exerciseForRound[i]];
  }

  // 정해둔 마지막 정산 전 애니메이션 시간
  const lastMotionTime = 1;
  // 정해둔 완료 시간(마지막 정산)
  const endingTime = 20;
  // 현재 라운드
  const [currentRound, setCurrentRound] = useState(0);
  // 처음에 헷갈리지 않도록 만들기 위한 것(시작하였는가? 준비부터 시작되었는가?)
  const [isStart, setIsStart] = useState(false);

  // console.log('운동 데이터어어어')
  // console.log(exerciseForRound);
  // console.log(exerciseForRound[currentRound]);

  // // 개인 운동 개수 저장을 위한 배열
  // const countForRound = [];
  // // 현재 운동 시 개수(운동이 완료되면 초기화)
  // const [currentCount, setCurrentCount] = useState(0);

  // // 자신 전투력
  // const [myCombatPower, setmyCombatPower] = useState(0);
  // // 전체 전투력
  // const [totalCombatPower, setTotalCombatPower] = useState(0);

  // 웹 소켓을 위한 변수 선언
  const [websocketClient, setWebsocketClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // 페이지 진입 시 room PK를 가지고 소켓 클라이언트 객체를 생성합니다.
    const client = new Socketest(waitingRoomId);
    setWebsocketClient(client);
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [hasJoined]);

  useEffect(() => {
    // 소켓 클라이언트가 생성되면 서버 웹소켓과 연결합니다. /sub/message/ 구독을 시작합니다.
    if (!websocketClient) return;
    const connectWebSocket = async () => {
      try {
        await websocketClient.connect();
        const subscription = websocketClient.subscribe(
          "/sub/message/" + waitingRoomId,
          (message) => {
            const parsedMessage = JSON.parse(message.body);
            switch (parsedMessage.type) {
              case "1":
                handleStartTimer();
                ClickEnd();
                break;
              case "2":
                addCombatPower(parsedMessage.body);
                console.log("전투력 올라간다");
                break;
              default:
                console.log("?");
            }
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          }
        );
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
  }, [websocketClient, hasJoined]);

  const DESTINATION = "/pub/message";
  const COMMONFORM = {
    // 메시지 타입 관계없이 공통적으로 쓰이는 내용입니다.
    user: myUserName,
    channel: waitingRoomId,
    // timestamp: getTime()
  };

  const sendTest1 = () => {
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: "1",
        startType: true,
      });
      websocketClient.send(DESTINATION, message);
    }
  };

  const sendTest2 = (roundWeight) => {
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: "2",
        body: roundWeight,
        currentRound,
      });
      websocketClient.send(DESTINATION, message);
    }
  };

  // 정해둔 중간 정산 시간
  // const [middleMotionTime, setMiddleMotionTime] = useState(6);

  // console.log(roomData)

  // 운동이 다 끝나고 [나가기] 클릭 시 이동하기 위한 navigate
  const navigate = useNavigate();

  // 유저 닉네임
  // const [myUserName, setMyUserName] = useState("");

  // setMyUserName(roomData.me.nickname)
  // 세션 (개인의 세션 = 대기방에 들어간 한 사람의 비디오라고 생각하면 된다.)
  const [session, setSession] = useState();
  const [mainStreamManager, setMainStreamManager] = useState();
  // 현재 컴퓨터에서 퍼블리셔(본인)
  const [publisher, setPublisher] = useState();
  // 현재 컴퓨터에서 구독자(다른 사람들)
  const [subscribers, setSubscribers] = useState([]);
  // 이 컴포넌트 안에서 입력한 대기방 고유 Id
  // (이건 아마 나중에는 쓸 필요는 없을 듯 - 같은 방 들어가기 확인용)
  const [inputWaitingRoomId, setInputWaitingRoomId] = useState(waitingRoomId || "");
  // 유효성 토큰 (로그인이 되었는가 // 나중에 다른 곳에서 받아와야 할 듯!)
  const acessToken = localStorage.getItem("accessToken");

  // 전투력 총합치 << 현재는 확인을 위해 넣은 것으로, 나중에는 모든 사람들 전투력 합산을 가져올 예정
  // const [CombatPower, setCombatPower] = useState(0);

  // 운동 개수를 가져온 변수 << 나중에 모든 사람들 전투력과 합산 해야함
  const [countPower, setCountPower] = useState(0);
  // // 프로그레스 바 게이지
  // const [combatGauge, setCombatGauge] = useState(0);
  // // 프로그레스 바 레벨(게이지가 몇번 다 찼는가?)
  // const [combatLevel, setCombatLevel] = useState(0);

  function ChangeCount(cnt) {
    setCountPower(cnt);
  }

  // 모달 열리고 닫힘 여부
  const [openModal, setOpenModal] = useState(false);

  // 현재 시간을 타이머 컴포넌트 안에서 변경하기 위한 함수
  function ChangeCurrentTime(time) {
    setCurrentTime(time);
  }

  // 프로그레스 바 게이지와 레벨(단계)를 넣어주기 위한 내용
  // useEffect(() => {
  //   const level = Math.floor((countPower*11) / 100);
  //   const gauge = (countPower*11) % 100;
  //   setCombatGauge(gauge);
  //   setCombatLevel(level);
  //   console.log(`잘 넣어집니당 ${gauge} ${combatGauge} / ${level} ${combatLevel}`);
  // }, [countPower])

  //타이머 관련으로 넣은 값들. 나중에 수정 필요함
  // 타이머에 넣을 숫자 < 초기값은 0으로 설정
  const [initialTime, setInitialTime] = useState(0);
  // 현재 시간(현재 지나가고 있는 시간)
  const [currentTime, setCurrentTime] = useState(0);
  // 타이머 시작 여부 상태
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (waitingRoomId) {
      // 처음에 들어왔을 때 받았던 대기방 고유 Id를 받아온다.
      setInputWaitingRoomId(waitingRoomId);
    }
  }, [waitingRoomId]);

  const joinTrainingRoom = useCallback(async () => {
    const OV = new OpenVidu();
    // 대기방에 참여하는 개개인의 세션(개인 비디오 화면 하나가 하나의 세션이라고 생각하면 됨)
    const mySession = OV.initSession();

    setSession(mySession);

    mySession.on("streamCreated", (event) => {
      if (event.stream.connection.connectionId !== mySession.connection.connectionId) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      }
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    try {
      const token = await getToken();
      await mySession.connect(token, { clientData: myUserName });

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: true,
      });

      await mySession.publish(publisher);
      setMainStreamManager(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.error("세션 연결에 실패하였습니다.", error.code, error.message);
    }
  }, [myUserName, inputWaitingRoomId]);

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }

    // 방을 나갔을 때 모달 없애기
    setOpenModal(false);

    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

  const byeBye = useCallback(() => {
    if (session) {
      session.disconnect();
    }

    // 방을 나갔을 때 모달 없애기
    setOpenModal(false);

    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);

    navigate("/home");
  }, [session]);

  const getToken = async () => {
    return await createToken(waitingRoomId);
  };

  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + acessToken,
          },
        }
      );
      return response.data.data.token;
    } catch (error) {
      console.error("토큰 만들기에 실패하였습니다.", error);
      throw error;
    }
  };

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== streamManager));
  }, []);

  // // 타이머 시작 설정
  // const handleSartTimer = () => {
  //   if (initialTime > 0) {
  //     setCurrentTime(initialTime);
  //     setTimerActive(true);
  //   }
  // }

  // 운동 시간인지 아닌지를 확인하기 위한 boolean (운동 시간이 아닐 때 카운트가 올라가지 않도록)
  const [isExercise, setIsExercise] = useState(false);

  // 타이머가 0이 되었을 때 다음 단계로 넘어가는 로직
  useEffect(() => {
    if (isStart === true && currentTime === 0 && timerActive === true) {
      // setInitialTime(-1);
      handleNextStep();
    }
  }, [isStart, currentTime, timerActive]);

  // 루틴 단계 넘어가기 로직
  const handleNextStep = () => {
    //들어오자마자 카메라 셋팅 단계로 넘어감
    if (currentStep === "ready") {
      setCurrentStep("setup");
      setInitialTime(setupTime);
      setCurrentTime(setupTime);
      setTimerActive(true);
    } else if (currentStep === "setup") {
      // 셋팅 단계 후 운동 시작
      setCurrentStep("exercise");
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setIsExercise(true);
      setTimerActive(true);
    } else if (currentStep === "exercise") {
      // 라운드에 따라 운동 후 휴식 or 마지막 화면 나오기
      if (currentRound < roundCount - 1) {
        setCurrentStep("rest");
        setInitialTime(restTime);
        setCurrentTime(restTime);
        setIsExercise(false);
        setTimerActive(true);
        setCurrentRound(currentRound + 1);
      } else {
        setCurrentStep("lastMotion");
        setInitialTime(lastMotionTime);
        setCurrentTime(lastMotionTime);
        setCurrentRound(currentRound + 1);
        setIsExercise(false);
        setTimerActive(true);
      }
      // } else if (currentStep === 'middleMotion') {
      //   setCurrentStep('rest');
      //   setInitialTime(restTime);
      //   setCurrentTime(restTime);
      //   setTimerActive(true);
    } else if (currentStep === "rest") {
      // setCurrentRound(currentRound + 1);
      setCurrentStep("exercise");
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setIsExercise(true);
      setTimerActive(true);
    } else if (currentStep === "lastMotion") {
      setCurrentStep("ending");
      setInitialTime(endingTime);
      setCurrentTime(endingTime);
      setIsExercise(false);
      setTimerActive(true);
    } else if (currentStep === "ending") {
      setCurrentStep("finish!");
      setIsExercise(false);
      setTimerActive(false);
      return;
    }
  };

  useEffect(() => {
    if (initialTime >= 0) {
      setCurrentTime(initialTime);
      setTimerActive(true);
    }
  }, [initialTime]);

  // 타이머 처음 시작할 때(준비 시간 넣어주기)
  const handleStartTimer = () => {
    setCurrentStep("ready");
    setInitialTime(0);
    setTimerActive(true);
    setIsStart(true);
  };

  // 특정 상태일 때(중간정산, 휴식, 마지막 모션 및 정산) 모달 나오도록
  useEffect(() => {
    if (["middleMotion", "lastMotion", "ending"].includes(currentStep)) {
      // 정산 전 마지막 모션 때 API 보내주기
      if (currentStep === "lastMotion") {
        getEndTime();

        // for (let i = 0; i < exerciseForRound.length; i++) {
        //   const roundRecord = {
        //     roundNumber: (i + 1),
        //     dictionaryName: exerciseForRound[i],
        //     exerciseCount: eachRoundCount[i]
        //   }
        //   roundRecordList[i] = roundRecord
        // }

        // ChangeStateOfRoundRecordListExist();

        // 잡은 몬스터 정보 불러오기
        getMonster()
          .then((data) => {
            console.log("불러온 몬스터 데이터:", data);
            setIsNewMonster(data.data.capturedMonster.new);
            setMonsterImgUrl(data.data.capturedMonster.imageUrl);
            setMonsterName(data.data.capturedMonster.name);
          })
          .catch((error) => {
            // 에러 처리
            console.error("몬스터 정보 불러오기 실패:", error);
          });
      }

      setOpenModal(true);
    } else if (currentStep === "finish!") {
      byeBye();
    } else {
      setOpenModal(false);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isRoundRecordListExist === true) {
      console.log("기록을 저장합니당1");
      console.log(finishRoundRecordList);
      // 기록 저장
      record(roomData.roomPk, endTime, finishRoundRecordList, myTotalCombatPower)
        .then((data) => {
          console.log("기록 후 데이터:", data);
          setUpdatedExp(data.data.updatedExp);
          setUpdatedLevel(data.data.updatedLevel);
          setIsLevelUp(data.data.isLevelUp);
          setRegionName(data.data.region.name);
          setUpdatedExpPercentage((data.data.updatedExp / 750) * 100);

          UpdateRegionScore(data.data.updatedRegionScore, data.data.totalContribute);
        })
        .catch((error) => {
          console.error("기록 저장 실패:", error);
        });
    }
  }, [isRoundRecordListExist]);

  // 기록 저장을 위한 API
  const record = async (roomId, endTime, finishRoundRecordList, myTotalCombatPower) => {
    try {
      console.log("기록을 저장합니당2");
      console.log(finishRoundRecordList);
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/${roomId}/complete`,
        {
          email: myUserEmail,
          endTime: endTime,
          personalCombatPower: myTotalCombatPower,
          totalCombatPower: totalCombatPower,
          participantsCount: subscribers.length + 1,
          stage: totalCombatLevel,
          roundRecordList: finishRoundRecordList,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${acessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("기록 저장에 실패하였습니다.", error);
      throw error;
    }
  };

  // 몬스터 정보를 가져오는 API
  const getMonster = async () => {
    try {
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/monster`,
        {
          email: myUserEmail,
          stage: 3, //totalCombatLevel
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${acessToken}`,
          },
        }
      );
      console.log("몬스터 데이터:", response.data);
      return response.data;
    } catch (error) {
      console.error("몬스터 불러오기가 실패하였습니다.", error);
      throw error;
    }
  };

  // 렌더링 구역
  return (
    <FadeAnime>
      <div className="">
        {!session ? (
          <div id="join">
            <h1>운동방 참여</h1>
            <form
              className="form-group"
              onSubmit={(e) => {
                e.preventDefault();
                joinTrainingRoom();
              }}
            >
              <p>
                <label>닉네임: </label>
              </p>
              <p>
                <label>세션 아이디 (선택 사항): </label>
                <input
                  className="form-control"
                  type="text"
                  value={inputWaitingRoomId}
                  onChange={(e) => setInputWaitingRoomId(e.target.value)}
                />
              </p>
              <div style={{ height: "20px" }}></div>
              <p className="text-center">
                <button className="btn btn-lg btn-success" type="submit">
                  운동 시작하기
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div id="session" className="training">
            <div className="training-header">
              <Timer
                currentTime={currentTime}
                timerActive={timerActive}
                ChangeCurrentTime={ChangeCurrentTime}
              />
            </div>
            <div className="training-frame">
              <div className="video-frame">
                <div className="my-video">
                  {publisher && (
                    <SelfVideo
                      streamManager={publisher}
                      countPower={countPower}
                      ChangeCount={ChangeCount}
                      sendTest2={sendTest2}
                      currentRound={currentRound}
                      exerciseForRound={exerciseForRound}
                      myCombatPower={myCombatPower}
                      eachRoundCount={eachRoundCount}
                      roundWeight={roundWeight}
                      isExercise={isExercise}
                      UpdateMyTotalCombatPower={UpdateMyTotalCombatPower}
                      myTotalCombatPower={myTotalCombatPower}
                      addMyCombatPower={addMyCombatPower}
                      updateEachRoundCount={updateEachRoundCount}
                      updateMyCombatPower={updateMyCombatPower}
                      changeIsPoseDetect={changeIsPoseDetect}
                    />
                  )}
                </div>
                <div className="other-video">
                  {subscribers.map((sub, i) => (
                    <>
                      <UserVideo key={i} num={i} streamManager={sub} />
                    </>
                  ))}
                </div>
              </div>
              <div className="progress-box">
                <TotalCombatPower
                  visualParts={[
                    {
                      percentage: `${(totalCombatGauge / 750) * 100}%`,
                      color: "#12D20E",
                    },
                  ]}
                />
                <div className="training-stage">
                  <p>{totalCombatLevel}</p>
                  <p>스테이지</p>
                </div>
              </div>
              <div className="training-aside">
                <div className="round-box-frame">
                  <div>
                    {Array.from({ length: roundCount }, (_, index) => (
                      <div
                        key={index}
                        className={`round-box ${currentRound === index ? "active" : ""}`}
                      >
                        <img
                          src={exerciseImages[exerciseForRound[index]]}
                          alt={exerciseName[exerciseForRound[index]]}
                          className="training-exercise-image"
                        />
                        {exerciseName[exerciseForRound[index]]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="soldier-box">
                  {currentStep === "rest" ? (
                    <>
                      <p className="training-message" align="center">
                        {exerciseForRound[currentRound] === "jumpingJack" ? (
                          <>
                            Next : {exerciseName[exerciseForRound[currentRound]]}
                            <br />
                            정면을 바라봐 주세요
                          </>
                        ) : (
                          <>
                            Next : {exerciseName[exerciseForRound[currentRound]]}
                            <br />
                            왼쪽을 바라봐 주세요
                          </>
                        )}
                      </p>
                      <img className="soldier-gif" src={restSoldier} alt="휴식용사" />
                    </>
                  ) : (
                    <>
                      {((isCaptain && !isPoseDetect) || (!isCaptain && !isPoseDetect)) && (
                        <button className="loading-button">포즈감지 준비중...</button>
                      )}

                      {(isCaptain && isPoseDetect && firstClick) && (
                        <button className="start-button" onClick={sendTest1}>
                          운동 시작!
                        </button>
                      )}
                      <img className="soldier-gif" src={exerciseSoldier} alt="운동용사" />
                    </>
                  )}
              </div>
            </div>
          </div>
          </div>
        )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            // display: 'flex',
            top: "12.5%",
            left: "50%",
            transform: "translate(-50%,0)",
            width: "80%",
            height: "70%",
            bgcolor: "white",
            // boxShadow: 24,
            p: 4,
            bgcolor: "background.Paper",
            backgroundImage: currentStep === "ending" ? `url(${completeScroll})` : "none",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* 중간 정산 화면 */}
          {currentStep === "middleMotion" && (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                backgroundColor: "skyblue",
              }}
            >
              <img
                style={{
                  width: "40%",
                }}
                src={standSoldier}
                alt="서있는 용사"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                  height: "100%",
                  backgroundColor: "coral",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "25%",
                    fontSize: "60px",
                    display: "flex",
                    justifyContent: "flex-end",
                    backgroundColor: "lemonchiffon",
                    p: 2,
                  }}
                >
                  <h1>중간 정산</h1>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "35%",
                    fontSize: "50px",
                    backgroundColor: "lightgreen",
                  }}
                >
                  <p>여기에는 사람들의 기여도</p>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "40%",
                    fontSize: "40px",
                    backgroundColor: "lightgray",
                  }}
                >
                  <p>이 아래에는 그 뭐냐 프로그레스 바</p>
                </div>
              </div>
            </div>
          )}
          {/* 마지막 모션 화면 */}
          {currentStep === "lastMotion" && <div></div>}

          {/* 마지막 정산 화면 =================================================이슬 */}
          {currentStep === "ending" && (
            <div
              style={{
                paddingTop: "130px",
                paddingBottom: "100px",
                paddingLeft: "190px",
                paddingRight: "180px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "90%",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column" /* 세로 방향으로 자식 요소를 배치 */,
                    justifyContent: "space-between" /* 자식 요소들 사이에 공간을 분배 */,

                    padding: "10px" /* 여백 설정 (필요에 따라 조정) */,
                    boxSizing: "border-box" /* 여백과 테두리를 포함하여 전체 너비와 높이 계산 */,
                  }}
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontFamily: "WarhavenR",
                    }}
                  >
                    {isNewMonster ? "NEW!" : ""}
                  </div>
                  <img
                    src={monsterImages[monsterName]}
                    // src={monsterImgUrl}
                    alt="잡은 몬스터"
                    className="training-monster-image"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  />
                  <div
                    style={{
                      color: "black",
                      fontSize: "20px",
                      marginTop: "auto" /* 위쪽의 여백을 자동으로 채워서 아래쪽으로 이동 */,
                      alignSelf: "flex-end" /* 자식 요소를 오른쪽 끝으로 정렬 */,
                      fontFamily: "WarhavenB",
                    }}
                  >
                    {monsterName}
                  </div>
                </div>

                <div
                  className="training-complte-right"
                  style={{
                    width: "70%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "15px",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                  }}
                >
                  <div className="training-complete-stage">
                    <div
                      style={{
                        color: "black",
                        marginBottom: "20px",
                        fontSize: "37px",
                        fontFamily: "WarhavenB",
                      }}
                    >
                      {totalCombatLevel} STAGE CLEAR!
                    </div>
                  </div>

                  <div className="training-complte-level">
                    <div
                      style={{
                        color: "black",
                        fontSize: "25px",
                        fontFamily: "WarhavenR",
                        marginBottom: "5px",
                      }}
                    >
                      LV. {updatedLevel} {isLevelUp ? "↑" : ""}
                    </div>
                    <StepProgressBar expPercentage={updatedExpPercentage}></StepProgressBar>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ color: "darkslategray", fontSize: "18px" }}>+{gainedExp}</div>
                    </div>
                  </div>

                  <div className="training-complte-season-region-score-text">
                    <div
                      style={{
                        color: "black",
                        fontSize: "20px",
                        fontFamily: "WarhavenR",
                        marginBottom: "5px",
                      }}
                    >
                      {regionName} 기여도
                    </div>
                    <StepProgressBar
                      expPercentage={updatedRegionScorePercentage}
                    ></StepProgressBar>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ color: "darkslategray", fontSize: "18px" }}>
                        +{myTotalCombatPower}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 나가기 버튼 */}
              <div
                style={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button className="btn btn-large btn-danger" onClick={byeBye}>
                  나가기
                </button>
              </div>
            </div>
          )}
          {/*=============================================== 이슬*/}
          {/* <div style={{
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            backgroundColor: 'skyblue',
            border:'3px solid black',
          }}>
            <div>
              <h2 id='modal-title'>현재 단계 : {currentStep}</h2>
              <p id='modal-description'>
                {currentStep === 'middleMotion' && '중간 모션 시간입니다.'}
                {currentStep === 'rest' && '휴식 시간입니다.'}
                {currentStep === 'lastMotion' && '마지막 모션 시간입니다.'}
                {currentStep === 'ending' && '정산 시간입니다.'}
              </p>
            </div>
            <div>
              {currentStep === 'rest' &&
                <div className="my-video">{publisher && <SelfVideo streamManager={publisher} ChangeCount={ChangeCount} />}</div>
              }
            </div>
          </div> */}
        </Box>
      </Modal>
    </div>
    </FadeAnime >
  );
};

export default TrainingRoomManager;
