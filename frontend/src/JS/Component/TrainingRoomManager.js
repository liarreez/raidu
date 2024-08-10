import React, { useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "../Component/UserVideo";
import SelfVideo from "./SelfVideo";
import SelfRestVideo from './SelfRestVideo';
import "../../CSS/TrainingRoomManager.css";
import TotalCombatPower from './TotalCombatPower';

import restSoldier from '../../Imgs/restSoldier.gif'
import standSoldier from '../../Imgs/standSoldier.png'

import burgerking from "../../Imgs/burgerking.png";

import Timer from './Timer';
import TimerRest from './TimerRest';

import { Socketest } from './Socketest';

import { Modal, Box } from '@mui/material';

import { Navigate, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';  // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트


const APPLICATION_SERVER_URL = API_URL+"/api/raidu/rooms";

// roomData = 대기방에서 받아온 정보들이 담긴 객체
const TrainingRoomManager = ({ roomData }) => {

  // 운동방이 시작했는가? (joinTrainingRoom을 한번만 하기 위해 넣은 확인용)
  const [hasJoined, setHasJoined] = useState(false);

  // 대기방에서 운동방으로 넘어올 때 받은 정보들을 저장해준 후, 운동방을 자동 시작
  useEffect(() => {
    if (!hasJoined) {
      console.log('방 정보 및 라운드별 가중치 제대로 나오나요?!---------');
      console.log(roomData);
      console.log(roundWeight);
      joinTrainingRoom();
      setHasJoined(true);
    }
  }, [hasJoined]);

  // waitingRoomId = 대기방 고유 Id
  const waitingRoomId = roomData.roomId;
  // 유저 닉네임
  const myUserName = roomData.userInfo.nickname;

  // 타이머 시작 한번만 하기 위해서 만든 상태
  const [firstClick, setFirstClick] = useState(true);

  // 처음 버튼 클릭 시, 버튼 안보이게 하기
  const ClickEnd = () => {
    setFirstClick(false);
  }

  // 현재 어떤 단계인가 (세팅, 운동, 휴식, 정산으로 나뉠듯)
  // 기본 상태는 ready
  // setup, exercise, rest, ending
  const [currentStep, setCurrentStep] = useState('ready');
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

  
  // 라운드 별 운동 가중치(운동에 따라 저장)
  const roundWeight = [];
  // 라운드 별 운동 횟수(count)
  const eachRoundCount = [];
  // 라운드 별 전투력(가중치 * 횟수)
  const myCombatPower = [];
  // 자신의 전투력
  const [myTotalCombatPower, setMyTotalCombatPower] = useState(0);

  // 실험용(바로바로 누적되는 자신의 전투력)
  let addMyCombatPower = 0;

  useEffect(() => {
    addMyCombatPower = 0;
    myCombatPower.forEach(power => {
      addMyCombatPower = addMyCombatPower + power
    });
  }, [myCombatPower])

  // 전체 전투력(모두의 전투력이 들어갈 예정)
  const [totalCombatPower, setTotalCombatPower] = useState(0);

  // 전체 전투력 합산(웹소켓을 통해)
  const addCombatPower = (score) => {
    setTotalCombatPower(totalCombatPower + score);
  };

  // 프로그레스 바에 들어가는 전체 전투력 게이지
  const [totalCombatGauge, setTotalCombatGauge] = useState(0);
  // 프로그레스 바가 다 찰때마다 올라가는 레벨(단계)
  const [totalCombatLevel, setTotalCombatLevel] = useState(0);

  // 프로그레스 바 게이지와 레벨(단계)를 넣어주기 위한 내용
  useEffect(() => {
    const level = Math.floor((totalCombatPower) / 750);
    const gauge = (totalCombatPower) % 750;
    setTotalCombatGauge(gauge);
    setTotalCombatLevel(level);
    console.log(`잘 넣어집니당 ${gauge} ${totalCombatGauge} / ${level} ${totalCombatLevel}`);
  }, [totalCombatPower])

  
  // const addMyCombatPower = (score, currentRound) => {
  //   myCombatPower[currentRound] += score;
  // }


  // 운동별 가중치(운동 종목 : 가중치)
  const exerciseScore = {
    'jumpingJack': 30,
    'lunge' : 50,
  }

  // 운동 가중치에 따라 라운드 별 운동 가중치 설정
  for (let i = 0; i < exerciseForRound.length; i++) {
    roundWeight[i] = exerciseScore[exerciseForRound[i]];
  }



  // 정해둔 마지막 정산 전 애니메이션 시간
  const lastMotionTime = 3;
  // 정해둔 완료 시간(마지막 정산)
  const endingTime = 6;
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
    return() => {
        if(client) {
            client.disconnect();
        }
    };
  }, [hasJoined]);
  
  useEffect(() => { 
      // 소켓 클라이언트가 생성되면 서버 웹소켓과 연결합니다. /sub/message/ 구독을 시작합니다.
      if(!websocketClient) return;
      const connectWebSocket = async () => {
          try {
              await websocketClient.connect();
              const subscription = websocketClient.subscribe('/sub/message/' + waitingRoomId, (message) => {
                  const parsedMessage = JSON.parse(message.body);
                  switch(parsedMessage.type){
                    case '1': handleStartTimer(); ClickEnd(); break;
                    case '2': addCombatPower(parsedMessage.body); console.log('전투력 올라간다'); break;
                    default: console.log('?')
                  }
                  setMessages((prevMessages) => [...prevMessages, parsedMessage]);
              });
              return () => {
                  if(subscription) subscription.unsubscribe();
                  websocketClient.disconnect();
              };
          } catch (error) {
              console.error('Error caused by websocket connecting process : ', error);
          }
      };
      connectWebSocket();
      return () => {
          if(websocketClient) {
              websocketClient.disconnect()
          }
      };
  }, [websocketClient, hasJoined]);

  const DESTINATION = '/pub/message';
  const COMMONFORM = { // 메시지 타입 관계없이 공통적으로 쓰이는 내용입니다.
    user: myUserName,
    channel: waitingRoomId,
    // timestamp: getTime()
};


  const sendTest1 = () => {
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: '1',
        startType: true,
      })
      websocketClient.send(DESTINATION, message);
    }
  };

  const sendTest2 = () => {
    if (websocketClient) {
      const message = JSON.stringify({
        ...COMMONFORM,
        type: '2',
        body: roundWeight[currentRound],
        currentRound,
      })
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
  const acessToken = localStorage.getItem('accessToken');
  // const token =
  //   "eyJhbGciOiJIUzUxMiJ9.eyJjYXRlZ29yeSI6IkFDQ0VTUyIsImVtYWlsIjoic3NhZnlAc3NhZnkuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI1MDAwMTgsImV4cCI6MTcyMzEwNDgxOH0.GAMSTSsS33cmxkty2r_ls4pY1xYDkvgflAhMUljGYOvBvOuHjRWZ9DKOCmVj0cwSvUmwwUMcqEadH-NPDVDsGQ";

  // 전투력 총합치 << 현재는 확인을 위해 넣은 것으로, 나중에는 모든 사람들 전투력 합산을 가져올 예정
  // const [CombatPower, setCombatPower] = useState(0);

  // 운동 개수를 가져온 변수 << 나중에 모든 사람들 전투력과 합산 해야함
  // const [countPower, setCountPower] = useState(0);
  // // 프로그레스 바 게이지
  // const [combatGauge, setCombatGauge] = useState(0);
  // // 프로그레스 바 레벨(게이지가 몇번 다 찼는가?)
  // const [combatLevel, setCombatLevel] = useState(0);

  // function ChangeCount(cnt) {
  //   setCountPower(cnt);
  // }

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
    setOpenModal(false)

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
    setOpenModal(false)

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
  const [isExercise, setIsExercise] = useState(false)

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
    if (currentStep === 'ready') {
      setCurrentStep('setup');
      setInitialTime(setupTime);
      setCurrentTime(setupTime);
      setTimerActive(true);
    } else if (currentStep === 'setup') { // 셋팅 단계 후 운동 시작
      setCurrentStep('exercise');
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setIsExercise(true);
      setTimerActive(true);
    } else if (currentStep === 'exercise') { // 라운드에 따라 운동 후 휴식 or 마지막 화면 나오기
      if (currentRound < roundCount - 1) {
        setCurrentStep('rest');
        setInitialTime(restTime);
        setCurrentTime(restTime);
        setIsExercise(false);
        setTimerActive(true);
        setCurrentRound(currentRound + 1);
      } else {
        setCurrentStep('lastMotion');
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
    } else if (currentStep === 'rest') {
      // setCurrentRound(currentRound + 1);
      setCurrentStep('exercise');
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setIsExercise(true);
      setTimerActive(true);
    } else if (currentStep === 'lastMotion') {
      setCurrentStep('ending');
      setInitialTime(endingTime);
      setCurrentTime(endingTime);
      setIsExercise(false);
      setTimerActive(true);
    } else if (currentStep === 'ending') {
      setCurrentStep('finish!');
      setIsExercise(false);
      setTimerActive(false);
      return;
    }
  }

  useEffect(() => {
    if (initialTime >= 0) {
      setCurrentTime(initialTime);
      setTimerActive(true);
    }
  }, [initialTime]);

  // 타이머 처음 시작할 때(준비 시간 넣어주기)
  const handleStartTimer = () => {
    setCurrentStep('ready');
    setInitialTime(0);
    setTimerActive(true);
    setIsStart(true);
  }

  // 특정 상태일 때(중간정산, 휴식, 마지막 모션 및 정산) 모달 나오도록
  useEffect(() => {
    if (['middleMotion', 'rest', 'lastMotion', 'ending'].includes(currentStep)) {
      
      // 정산 전 마지막 모션 때 API 보내주기
      if (currentStep === 'lastMotion') {
        // 마지막 라운드 저장을 위해서 현재 라운드 + 1 해주기
        // setCurrentRound(currentRound + 1);
        // 현재 시간 받아주기
        const nowDate = Date.now()
        // 한국 시간으로 로컬라이징 + 저장 포멧
        const endTime = new Date(nowDate + (9 * 60 * 60 * 1000)).toISOString().slice(0, 19);
        
        console.log('-------------------시간---------------------')
        console.log(nowDate, endTime)

        // API로 줄 roundRecordList 만들기
        const roundRecordList = [];

        for (let i = 0; i < exerciseForRound.length; i++) {
          const roundRecord = {
            roundNumber: (i + 1),
            dictionaryName: exerciseForRound[i],
            exerciseCount: eachRoundCount[i]
          }
          roundRecordList[i] = roundRecord
        }

        // 라운드별 자신의 전투력으로 총 전투력 만들기
        myCombatPower.forEach(power => {
          setMyTotalCombatPower(myTotalCombatPower + power);
        })

        // 기록 저장

        // 잡은 몬스터 정보 불러오기


      }

      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [currentStep]);


  // 기록 저장을 위한 API
  const record = async (roomId, endTime, roundRecordList) => {
    try {
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/${roomId}/complete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + acessToken,
          },
          body: {
            email: 'email 받으면 넣기',
            endTime: endTime,
            personalCombatPower: myTotalCombatPower,
            totalCombatPower: totalCombatPower,
            participantsCount: subscribers.length,
            stage: totalCombatLevel,
            roundRecordList: roundRecordList,
          }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + acessToken,
          },
          body: {
            "email": 'email 받으면 넣기',
            "stage": totalCombatLevel,
          }
          
        }
      );
      return response.data;
    } catch (error) {
      console.error("몬스터 불러오기가 실패하였습니다.", error);
      throw error;
    }
  };


  return (
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
              {/* <input
                className="form-control"
                type="text"
                value={myUserName}
                // onChange={(e) => setMyUserName(e.target.value)}
                required
              /> */}
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
          <div id="session-header" className="training-header">
            {/* <div>
              <h1 id="session-title">운동방입니다.</h1>
              <button className="btn btn-large btn-danger" onClick={leaveSession}>
                운동방 나가기
              </button>
              <progress vlaue={null} />
            </div> */}
            <div>
              <h2>현재 단계 : {currentStep}</h2>
              {/* <input
                type='number'
                vlaue={initialTime}
                onChange={(e) => setInitialTime(Number(e.target.value))}
                min='0'
              /> */}
              {firstClick && 
                <button onClick={sendTest1}>타이머 시작</button>
              }
            </div>
              <Timer currentTime={currentTime} timerActive={timerActive} ChangeCurrentTime={ChangeCurrentTime} />
          </div>
          <div className="training-frame">
            <div className="video-frame">
              <div className="other-video">
                  {subscribers.map((sub, i) => (
                  <>
                    <UserVideo key={i} num={i} streamManager={sub} />
                    <p>{JSON.parse(sub.stream.connection.data).clientData}</p>
                  </>
                ))}
              </div>
                <div className="my-video">{publisher &&
                  <SelfVideo streamManager={publisher}
                    // ChangeCount={ChangeCount}
                    sendTest2={sendTest2}
                    currentRound={currentRound} exerciseForRound={exerciseForRound}
                    myCombatPower={myCombatPower} eachRoundCount={eachRoundCount}
                    roundWeight={roundWeight} isExercise={isExercise}
                    addMyCombatPower={addMyCombatPower}
                    
                  />}
                </div>
            </div>
            <div className='progress-box'>
              {/* <h3>총 전투력 넣을 예정</h3> */}
              {/* <div>
                <input
                  type="number"
                  value={combatGauge}
                  // onChange={(e) => setCombatPower(e.target.value)}
                  min='0'
                  max='100'
                />
              </div> */}
                <TotalCombatPower
                  visualParts={[
                    {
                      percentage: `${ totalCombatGauge }%`,
                      color: "orange"
                    }
                  ]}
                />
                <p style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                }}>단계 : { totalCombatLevel }</p>
            </div>
            <div className='soldier-box'>
                {/* <h1>용사 gif</h1> */}
                <img className='soldier-gif' src={restSoldier} alt="휴식용사"/>
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
        <Box sx={{
          position: 'absolute',
          // display: 'flex',
          top: '12.5%',
          left: '50%',
          transform: 'translate(-50%,0)',
          width: '80%',
          height: '65%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {/* 중간 정산 화면 */}
          {currentStep === 'middleMotion' &&
            <div style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              backgroundColor:'skyblue',
            }}>
              <img style={{
                width:'40%',
              }} src={standSoldier} alt="서있는 용사" />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '60%',
                height: '100%',
                backgroundColor:'coral',
              }}>
                <div style={{
                  width: '100%',
                  height:'25%',
                  fontSize: '60px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  backgroundColor: 'lemonchiffon',
                  p: 2,
                }}>
                  <h1>중간 정산</h1>
                </div>
                <div style={{
                  width: '100%',
                  height: '35%',
                  fontSize: '50px',
                  backgroundColor:'lightgreen'
                }}>
                  <p>여기에는 사람들의 기여도</p>
                </div>
                <div style={{
                  width: '100%',
                  height: '40%',
                  fontSize: '40px',
                  backgroundColor:'lightgray',
                }}>
                  <p>이 아래에는 그 뭐냐 프로그레스 바</p>
                </div>
              </div>
            </div>
          }
          {/* 휴식 시간 화면 */}
          {currentStep === 'rest' &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              border: '3px solid red'
            }}>
              {/* 타이머 넣을 div */}
              <div style={{
                width: '100%',
                height: '20%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
                // backgroundColor:'coral',
              }}>
                <TimerRest currentTime={currentTime} timerActive={timerActive}/>
              </div>
              {/* 자기 화면 및 운동 선택 div */}
              <div style={{
                display: 'flex',
                width: '100%',
                height: '80%',
              }}>
                {/* 자기 화면 div */}
                <div style={{
                  width: '50%',
                  height: '100%',
                  border: '2px solid purple'
                }}>
                  {publisher &&
                    <SelfRestVideo
                    streamManager={publisher}
                    // ChangeCount={ChangeCount}
                    />}
                </div>
                {/* 운동 선택 div */}
                <div style={{
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '2px solid blue'
                }}>
                  <div style={{
                    width: '100%',
                    height: '20%',
                    fontSize: '40px',
                    backgroundColor: 'lavender',
                  }}>
                    <p>휴식 시간</p>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '40%',
                    fontSize: '30px',
                    backgroundColor: 'lightcyan',
                  }}>
                    <p>운동 선택 넣을 예정</p>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '40%',
                    fontSize: '30px',
                    backgroundColor: 'lightpink',
                  }}>
                    <p>쉬는 용사 넣을 예정</p>
                  </div>
                </div>

              </div>
            </div>
          }
          {/* 마지막 모션 화면 */}
          {currentStep === 'lastMotion' &&
            <div>

            </div>
          }
          {/* 마지막 정산 화면 */}
          {currentStep === 'ending' &&
            <div>
              
              {/* 아래 정보들 */}
              <div style={{
                width: '100%',
                height: '90%',
                display:'flex',
              }}>
                {/* 몬스터 정보 */}
                <div style={{
                  width: '30%',
                  height: '100%',
                }}>
                  <img src={burgerking} alt="잡은 몬스터"/>
                </div>
                {/* 다른 정보들 */}
                <div style={{
                  width: '70%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor:'cyan',
                }}>
                </div>
              </div>

              {/* 나가기 버튼 */}
              <div style={{
                width: '100%',
                height: '10%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <button className="btn btn-large btn-danger" onClick={byeBye}>
                  나가기
                </button>
              </div>
            </div>
          }
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
  );
};

export default TrainingRoomManager;
