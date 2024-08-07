import React, { useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideo from "../Component/UserVideo";
import SelfVideo from "./SelfVideo";
import "../../CSS/TrainingRoomManager.css";
import TotalCombatPower from './TotalCombatPower';

import restSoldier from '../../Imgs/restSoldier.gif'
import standSoldier from '../../Imgs/standSoldier.png'

import Timer from './Timer';

import { Modal, Box } from '@mui/material';

const APPLICATION_SERVER_URL = "http://localhost:8080/api/raidu/rooms/sessions";

// roomInfo = 대기방에서 받아온 정보들이 담긴 객체
const TrainingRoomManager = ({ roomInfo }) => {

  // waitingRoomId = 대기방 고유 Id
  const waitingRoomId = roomInfo.roomId;

  // 유저 닉네임
  const [myUserName, setMyUserName] = useState("");
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
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJjYXRlZ29yeSI6IkFDQ0VTUyIsImVtYWlsIjoic3NhZnlAc3NhZnkuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjI1MDAwMTgsImV4cCI6MTcyMzEwNDgxOH0.GAMSTSsS33cmxkty2r_ls4pY1xYDkvgflAhMUljGYOvBvOuHjRWZ9DKOCmVj0cwSvUmwwUMcqEadH-NPDVDsGQ";

  // 전투력 총합치 << 현재는 확인을 위해 넣은 것으로, 나중에는 모든 사람들 전투력 합산을 가져올 예정
  const [CombatPower, setCombatPower] = useState(0);

  // 운동 개수를 가져온 변수 << 나중에 모든 사람들 전투력과 합산 해야함
  const [countPower, setCountPower] = useState(0);
  // 프로그레스 바 게이지
  const [combatGauge, setCombatGauge] = useState(0);
  // 프로그레스 바 레벨(게이지가 몇번 다 찼는가?)
  const [combatLevel, setCombatLevel] = useState(0);


  // 루틴 만들기... 인데 일단은 받아올 수 없으니 임시로 만들기.
  // 나중에 그냥 받아와도 괜찮고, 여기에 저장해도 OK.
  // 현재 어떤 단계인가 (세팅, 운동, 휴식, 정산으로 나뉠듯)
  const [currentStep, setCurrentStep] = useState('ready');
  // 정해둔 셋팅 시간(준비시간)
  const [setupTime, setSetupTime] = useState(3);
  // 정해둔 운동 시간
  const [exerciseTime, setExerciseTime] = useState(2);
  // 정해둔 중간 정산 시간
  const [middleMotionTime, setMiddleMotionTime] = useState(2);
  // 정해둔 휴식 시간
  const [restTime, setRestTime] = useState(8);
  // 정해둔 마지막 정산 전 애니메이션 시간
  const [lastMotionTime, setLastMotionTime] = useState(3);
  // 정해둔 완료 시간
  const [endingTime, setEndingTime] = useState(4);
  // 총 라운드 수
  const [roundCount, setRoundCount] = useState(2);
  // 현재 라운드
  const [currentRound, setCurrentRound] = useState(0);
  // 처음에 헷갈리지 않도록 만들기 위한 것(시작하였는가? 준비부터 시작되었는가?)
  const [isStart, setIsStart] = useState(false);

  // 모달 열리고 닫힘 여부
  const [openModal, setOpenModal] = useState(false);

  function ChangeCount(cnt) {
    setCountPower(cnt);
  }

  // 현재 시간을 타이머 컴포넌트 안에서 변경하기 위한 함수
  function ChangeCurrentTime(time) {
    setCurrentTime(time);
  }
  

  // 프로그레스 바 게이지와 레벨(단계)를 넣어주기 위한 내용
  useEffect(() => {
    const level = Math.floor((countPower*11) / 100);
    const gauge = (countPower*11) % 100;
    setCombatGauge(gauge);
    setCombatLevel(level);
    console.log(`잘 넣어집니당 ${gauge} ${combatGauge} / ${level} ${combatLevel}`);
  }, [countPower])

  //타이머 관련으로 넣은 값들. 나중에 수정 필요함
  // 타이머에 넣을 숫자 < 초기값은 0으로 설정
  const [initialTime, setInitialTime] = useState(0);
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
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
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

    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

  const getToken = async () => {
    return await createToken(inputWaitingRoomId || waitingRoomId);
  };

  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        `${APPLICATION_SERVER_URL}/${sessionId}/connections`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
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


  // 타이머가 0이 되었을 때 다음 단계로 넘어가는 로직
  useEffect(() => {
    if (isStart === true && currentTime === 0 && timerActive === true) {
      // setInitialTime(-1);
      handleNextStep();
    }
  }, [isStart, currentTime, timerActive]);

  // 루틴 단계 넘어가기 로직
  const handleNextStep = () => {
    // 현재 단계가 준비단계면 운동으로 넘어간다.
    // let nextStep;
    // let nextTime;
    if (currentStep === 'ready') {
      // nextStep = 'setup';
      // nextTime = setupTime;
      setCurrentStep('setup');
      setInitialTime(setupTime);
      setCurrentTime(setupTime);
      setTimerActive(true);
    } else if (currentStep === 'setup') {
      // nextStep = 'exercise';
      // nextTime = exerciseTime;
      setCurrentStep('exercise');
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setTimerActive(true);
    } else if (currentStep === 'exercise') {
      if (currentRound < roundCount - 1) {
        // nextStep = 'middleMotion';
        // nextTime = middleMotionTime;
        setCurrentStep('middleMotion');
        setInitialTime(middleMotionTime);
        setCurrentTime(middleMotionTime);
        setTimerActive(true);
        setCurrentRound(currentRound + 1);
      } else {
        // nextStep = 'lastMotion';
        // nextTime = lastMotionTime;
        setCurrentStep('lastMotion');
        setInitialTime(lastMotionTime);
        setCurrentTime(lastMotionTime);
        setTimerActive(true);
      }
    } else if (currentStep === 'middleMotion') {
      // nextStep = 'rest';
      // nextTime = restTime;
      setCurrentStep('rest');
      setInitialTime(restTime);
      setCurrentTime(restTime);
      setTimerActive(true);
    } else if (currentStep === 'rest') {
      // nextStep = 'exercise';
      // nextTime = exerciseTime;
      setCurrentStep('exercise');
      setInitialTime(exerciseTime);
      setCurrentTime(exerciseTime);
      setTimerActive(true);
    } else if (currentStep === 'lastMotion') {
      // nextStep = 'ending';
      // nextTime = endingTime
      setCurrentStep('ending');
      setInitialTime(endingTime);
      setCurrentTime(endingTime);
      setTimerActive(true);
    } else if (currentStep === 'ending') {
      setCurrentStep('finish!')
      setTimerActive(false);
      return;
    }

    // setCurrentStep(nextStep);
    // setInitialTime(nextTime);
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
    // setInitialTime(5);
    // console.log(setupTime, initialTime);
    // setCurrentTime(setupTime);
    setTimerActive(true);
    setIsStart(true);
  }

  // 특정 상태일 때(중간정산, 휴식, 마지막 모션 및 정산) 모달 나오도록
  useEffect(() => {
    if (['middleMotion', 'rest', 'lastMotion', 'ending'].includes(currentStep)) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [currentStep]);

  

  return (
    <div className="container">
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
              <input
                className="form-control"
                type="text"
                value={myUserName}
                onChange={(e) => setMyUserName(e.target.value)}
                required
              />
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
            <div>
              <h1 id="session-title">운동방입니다.</h1>
              <button className="btn btn-large btn-danger" onClick={leaveSession}>
                운동방 나가기
              </button>
              <progress vlaue={null} />
            </div>
            <div>
              <h2>현재 단계 : {currentStep}</h2>
              {/* <input
                type='number'
                vlaue={initialTime}
                onChange={(e) => setInitialTime(Number(e.target.value))}
                min='0'
              /> */}
              <button onClick={handleStartTimer}>타이머 시작</button>
            </div>
              <Timer currentTime={currentTime} timerActive={timerActive} ChangeCurrentTime={ChangeCurrentTime} />
          </div>
          <div className="training-frame">
            <div className="video-frame">
              <div className="other-video">
                {subscribers.map((sub, i) => (
                    <UserVideo key={i} streamManager={sub} />
                ))}
              </div>
              <div className="my-video">{publisher && <SelfVideo streamManager={publisher} ChangeCount={ChangeCount} />}</div>
            </div>
            <div className='progress-box'>
              {/* <h3>총 전투력 넣을 예정</h3> */}
              <div>
                <input
                  type="number"
                  value={combatGauge}
                  // onChange={(e) => setCombatPower(e.target.value)}
                  min='0'
                  max='100'
                />
              </div>
                <p>단계 : { combatLevel }</p>
              <TotalCombatPower
                visualParts={[
                  {
                    percentage: `${combatGauge}%`,
                    color: "orange"
                  }
                ]}
              />
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
                  fontSize: '80px',
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
                backgroundColor:'coral',
              }}>
                {/* <Timer currentTime={currentTime} timerActive={timerActive} ChangeCurrentTime={ChangeCurrentTime} /> */}
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
                  {publisher && <SelfVideo streamManager={publisher} ChangeCount={ChangeCount} />}
                </div>
                {/* 운동 선택 div */}
                <div style={{
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
