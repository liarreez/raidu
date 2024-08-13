import React, { useEffect, useRef, useState } from "react";
import OpenViduVideo from '../Component/OpenViduVideo';

import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import '../../CSS/SelfVideo.css'

const SelfVideo = (props) => {
  const NOSE = 0;
  const LEFT_EYE = 1;
  const RIGHT_EYE = 2;
  const LEFT_EAR = 3;
  const RIGHT_EAR = 4;
  const LEFT_SHOULDER = 5;
  const RIGHT_SHOULDER = 6;
  const LEFT_ELBOW = 7;
  const RIGHT_ELBOW = 8;
  const LEFT_WRIST = 9;
  const RIGHT_WRIST = 10;
  const LEFT_HIP = 11;
  const RIGHT_HIP = 12;
  const LEFT_KNEE = 13;
  const RIGHT_KNEE = 14;
  const LEFT_ANKLE = 15;
  const RIGHT_ANKLE = 16;


  const [bodyState, setBodyState] = useState(false);
  // const [jumpingJack, setJumpingJack] = useState(false)
  // const [lunge, setLunge] = useState(false)

  // 현재 라운드에 선택한 운동을 넣을 변수
  const [selectedExercise, setSelectedExercise] = useState();

  // 현재 라운드 선택 운동 ref
  const selectExerciseRef = useRef('')
  // let selectedExercise = '';
  // const setSelectedExercise = (newSelect) => {
  //   selectedExercise = newSelect;
  // };

  // 라운드가 바뀔 때 넣을 운동 변경 로직
  const changeSelectedExercise = (newRound) => {
    console.log('들어온 값은?');
    console.log(newRound);
    console.log('기존 운동');
    console.log(selectedExercise);
    setSelectedExercise((prevExercise) => {
      console.log('운동을 잘 확인할 수 있나?');
      console.log(props.exerciseForRound[newRound]);
      const newExercise = props.exerciseForRound[newRound];
      console.log('바뀐 운동');
      console.log(newExercise);
      return newExercise;
    });

    console.log('ref는 잘 들어가나요?');
    selectExerciseRef.current = props.exerciseForRound[newRound];
    console.log(selectExerciseRef.current);
  }

  // 현재 라운드를 알려주는 변수(props로 가져온 현재 라운드와는 다른 변수이다. < 그 아이를 집어넣을 예정)
  const [nowRound, setnowRound] = useState();

  // 맨 처음 실행 한번만을 확인하기 위해 만든 것
  const [nowStart, setNowStart] = useState(false)

  // 처음에 비디오가 실행될 때, 현재 라운드와 운동을 바꿔줘야 한다.
  useEffect(() => {
    if (!nowStart) {
      console.log(props)
      setNowStart(true);
      // const nowExercise = props.exerciseForRound[0]
      // setSelectedExercise(props.exerciseForRound[0]);
      changeSelectedExercise(0);
      setnowRound(0);
      // initializeModel();
    }
  }, [])

  // 라운드와 운동이 바뀌면 모델을 실행시켜준다.
  // => 아래 nowRound useEffect에서 같이 관리하기로 바꿈
  // useEffect(() => {
  //   console.log('비디오 시작합니다.');
  //   console.log(props.exerciseForRound[0]);
  //   console.log(selectedExercise);
  //   console.log('현재 라운드')
  //   console.log(nowRound);
  //   initializeModel();
  // }, [nowRound, selectedExercise])



  let stageOfJumpingJack = "down";
  let stageOfLunge = "up";

  // const [count, setCount] = useState(0);
  // 운동 개수를 세줄 변수 (라운드별로 초기화 예정)
  let count = 0;
  const setCount = (num) => {
    count = num;
  };

  // 비디오에서 보여지는 내 총 전투력
  // const [selfCombatPower, setSelfCombatPower] = useState(0);
  let selfCombatPower = 0;

  // 전투력 다시 할당해주는 함수
  const setSelfCombatPower = (power) => {
    selfCombatPower = power;
  }

  // 포즈 감지를 위한 모델을 만들
  const makeModel = async (video) => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );

    console.log("포즈 감지 시작");
    props.changeIsPoseDetect();
    await detectModel(detector, video);
  };

  // 포즈 감지를 하는 함수 (무한 재귀)
  const detectModel = async (detector, video) => {
    const poses = await detector.estimatePoses(video);
    if (poses && poses.length > 0) {
      const pose = poses[0];
      processPose(pose, selectExerciseRef.current)
    }
    setTimeout(() => detectModel(detector, video), 100);
  };

  // 전신이 다 보이는지 여부를 반환하는 함수
  function isFullBodyVisible(pose) {
    return (
      pose.keypoints[LEFT_SHOULDER].score > 0.2 &&
      pose.keypoints[LEFT_HIP].score > 0.2 &&
      pose.keypoints[LEFT_WRIST].score > 0.2 &&
      pose.keypoints[LEFT_ANKLE].score > 0.2 &&
      pose.keypoints[RIGHT_SHOULDER].score > 0.2 &&
      pose.keypoints[RIGHT_HIP].score > 0.2 &&
      pose.keypoints[RIGHT_WRIST].score > 0.2 &&
      pose.keypoints[RIGHT_ANKLE].score > 0.2
    );
  }

  // 감지한 포즈를 현재 선택된 운동이 무엇인지에 따라 해당 운동 함수 호출
  const processPose = (pose, currentExercise) => {
    if (isFullBodyVisible(pose)) {
      // console.log('지금 무슨 운동?');
      // console.log(selectedExercise);
      setBodyState(true);

      if (currentExercise === "jumpingJack") {
        countingJumpingJack(pose);
      } else if (currentExercise === "lunge") {
        countingLunge(pose);
      } else if(currentExercise === "sitUp"){
        countingSitUp(pose);
      } else if(currentExercise === "pushUp"){
        countingPushUp(pose);
      } else if(currentExercise === "squat"){
        countingSquat(pose);
      }
    } else {
      setBodyState(false);
    }
  };

  // 각도 계산 함수
  function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }


  // 카운터 증가 함수
  const updateCount = () => {

    // 운동 시간에만 카운트가 올라갈 수 있도록 만들기
    console.log('카운트가 증가합니당');
    console.log(count);
    const newCount = count + 1;
    setCount(newCount);



    // props.eachRoundCount[props.currentRound] = newCount
    // props.ChangeEachRoundCount(props.currentRound, newCount);




    console.log('바뀐 카운트');
    console.log(count);
    // console.log(props.eachRoundCount, props.eachRoundCount[props.currentRound])
    props.ChangeCount(newCount);

    console.log('현재 라운드!!!');
    console.log(nowRound);
    console.log('현재 운동 가중치');
    console.log(props.roundWeight[nowRound]);

    // 자신의 현재 점수에서 가중치를 더해준다.
    props.UpdateMyTotalCombatPower(props.roundWeight[nowRound]);

    // 카운트가 올라간걸 웹소켓으로 뿌린다.
    // (보내주는건 운동 가중치 => 해당 운동 가중치를 카운트가 오를 때마다 보내줌)
    props.sendTest2(props.roundWeight[nowRound]);

    const newCombatPower = props.myCombatPower[props.currentRound] + props.roundWeight[props.currentRound]
    // props.ChangeMyCombatPower(props.currentRound, newCombatPower);

    // props.ChangeAddMyCombatPower(props.roundWeight[props.currentRound]);

    //현재 라운드에 설정되어 있는 운동의 가중치 * 운동 횟수로 점수 설정
    // setSelfCombatPower(selfCombatPower + (count * props.roundWeight[nowRound]));
    const newSelfCombatPower = selfCombatPower + props.roundWeight[nowRound];
    setSelfCombatPower(newSelfCombatPower);
    console.log(selfCombatPower);

    // document.querySelector(".count-box > p").innerText = `전투력 : ${selfCombatPower}`;
    // document.querySelector(".count-box > span").innerText = `숫자 : ${count}`;


    // console.log(`Current count: ${count}`);
    if (props.isExercise === true) {
    }
  };

  // 팔벌려뛰기 카운팅 함수
  const countingJumpingJack = (pose) => {
    const leftShoulder = pose.keypoints[LEFT_SHOULDER];
    const leftHip = pose.keypoints[LEFT_HIP];
    const leftWrist = pose.keypoints[LEFT_WRIST];
    const leftAnkle = pose.keypoints[LEFT_ANKLE];

    const rightShoulder = pose.keypoints[RIGHT_SHOULDER];
    const rightHip = pose.keypoints[RIGHT_HIP];
    const rightWrist = pose.keypoints[RIGHT_WRIST];
    const rightAnkle = pose.keypoints[RIGHT_ANKLE];

    const angle1 = calculateAngle(leftHip, leftShoulder, leftWrist);
    const angle2 = calculateAngle(rightHip, rightShoulder, rightWrist);
    const angle3 = calculateAngle(leftShoulder, leftHip, leftAnkle);
    const angle4 = calculateAngle(rightShoulder, rightHip, rightAnkle);

    if (angle1 < 30 && angle2 < 30 && angle3 > 150 && angle4 > 150 && stageOfJumpingJack === "up") {
      stageOfJumpingJack = "down";
      updateCount();
    }
    if (
      angle1 > 110 &&
      angle2 > 110 &&
      angle3 < 160 &&
      angle4 < 160 &&
      stageOfJumpingJack === "down"
    ) {
      stageOfJumpingJack = "up";
    }
  };

  // 런지 카운팅 함수
  const countingLunge = (pose) => {
    const leftHip = pose.keypoints[LEFT_HIP];
    const leftKnee = pose.keypoints[LEFT_KNEE];
    const leftAnkle = pose.keypoints[LEFT_ANKLE];

    const rightHip = pose.keypoints[RIGHT_HIP];
    const rightKnee = pose.keypoints[RIGHT_KNEE];
    const rightAnkle = pose.keypoints[RIGHT_ANKLE];

    const leftShoulder = pose.keypoints[LEFT_SHOULDER];
    const rightShoulder = pose.keypoints[RIGHT_SHOULDER];

    // 골반-무릎-발목
    const angle1 = calculateAngle(leftHip, leftKnee, leftAnkle);
    const angle2 = calculateAngle(rightHip, rightKnee, rightAnkle);

    // 어깨-골반-무릎
    const angle3 = calculateAngle(leftShoulder, leftHip, leftKnee);
    const angle4 = calculateAngle(rightShoulder, rightHip, rightKnee);

    if (
      angle1 > 80 &&
      angle1 < 100 &&
      angle2 > 80 &&
      angle2 < 100 &&
      angle3 > 70 &&
      angle3 < 100 &&
      angle4 > 160 &&
      angle4 < 200
    ) {
      stageOfLunge = "leftDown";
    }
    if (
      angle1 > 80 &&
      angle1 < 100 &&
      angle2 > 80 &&
      angle2 < 100 &&
      angle4 > 70 &&
      angle4 < 100 &&
      angle3 > 160 &&
      angle3 < 200
    ) {
      stageOfLunge = "rightDown";
    }
    if (stageOfLunge === "leftDown" && angle3 > 160 && angle3 < 200) {
      stageOfLunge = "up";
      updateCount();
    }
    if (stageOfLunge === "rightDown" && angle4 > 160 && angle4 < 200) {
      stageOfLunge = "up";
      updateCount();
    }
  };

  // 윗몸일으키기
  let stageOfSitUp = "up";
  const countingSitUp = (pose) => {
    const rightShoulder = pose.keypoints[RIGHT_SHOULDER];
    const rightHip = pose.keypoints[RIGHT_HIP];
    const rightKnee = pose.keypoints[RIGHT_KNEE];
    const rightElbow = pose.keypoints[RIGHT_ELBOW];
    const rightWrist = pose.keypoints[RIGHT_WRIST];

    const bodyAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const armAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    if (
      armAngle < 90 &&
      bodyAngle < 65 &&
      rightShoulder.y < rightHip.y &&
      rightKnee.y < rightHip.y &&
      stageOfSitUp === "down"
    ) {
      stageOfSitUp = "up";
      updateCount();
    }
    if (bodyAngle > 90 && stageOfSitUp === "up") {
      stageOfSitUp = "down";
    }
  };

  // 팔굽혀펴기
  let stageOfPushUp = "up";
  const countingPushUp = (pose) => {
    const rightWrist = pose.keypoints[RIGHT_WRIST];
    const rightElbow = pose.keypoints[RIGHT_ELBOW];
    const rightShoulder = pose.keypoints[RIGHT_SHOULDER];

    const rightHip = pose.keypoints[RIGHT_HIP];
    const rightKnee = pose.keypoints[RIGHT_KNEE];

    const elbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
    const backAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    if (elbowAngle > 130 && elbowAngle < 230) {
      if (stageOfPushUp === "down") {
        updateCount();
      }
      stageOfPushUp = "up";
    }
    if (elbowAngle > 70 && elbowAngle < 120) {
      stageOfPushUp = "down";
    }
  };

// 스쿼트
const squatStageTracker = {
  seq: [],
  SQUAT_COUNT: 0,
  IMPROPER_SQUAT: 0,
  INCORRECT_POSTURE: false,
};
  let threshNormal = [0, 32];
  let threshTrans = [35, 65];
  let threshPass = [70, 95];

  const countingSquat = (pose) => {
    const rightHip = pose.keypoints[RIGHT_HIP];
    const rightKnee = pose.keypoints[RIGHT_KNEE];

    let kneeVert = { x: rightKnee.x, y: 0 };

    const kneeVertAngle = calculateAngle(kneeVert, rightKnee, rightHip);
    const currentStageOfSquat = determineSquatStage(kneeVertAngle);

    updateSquatSequence(currentStageOfSquat)
    if (currentStageOfSquat === "s1") {
      handleSquatStage(currentStageOfSquat);
    }
  };
  
// 상태에 따라 현재 상태 결정하는 함수
function determineSquatStage(kneeVertAngle) {
  let stageOfSquat = "";
  if (threshNormal[0] <= kneeVertAngle && kneeVertAngle <= threshNormal[1]) {
    stageOfSquat = "s1";
  } else if (
    threshTrans[0] <= kneeVertAngle &&
    kneeVertAngle <= threshTrans[1]
  ) {
    stageOfSquat = "s2";
  } else if (threshPass[0] <= kneeVertAngle && kneeVertAngle <= threshPass[1]) {
    stageOfSquat = "s3";
  }
  return stageOfSquat;
}


// 상태 시퀀스를 업데이트하는 함수
function updateSquatSequence(stage) {
  const seq = squatStageTracker.seq;
  if (stage === "s2") {
    if (
      (!seq.includes("s3") && seq.filter((s) => s === "s2").length === 0) ||
      (seq.includes("s3") && seq.filter((s) => s === "s2").length === 1)
    ) {
      seq.push(stage);
    }
  } else if (stage === "s3") {
    if (!seq.includes("s3") && seq.includes("s2")) {
      seq.push(stage);
    }
  }
}

// 상태를 처리하는 함수
function handleSquatStage(currentSquatStage) {
  const seq = squatStageTracker.seq;
    if (seq.length === 3 && !squatStageTracker.INCORRECT_POSTURE) {
      squatStageTracker.SQUAT_COUNT++;
      updateCount();
    } else if (seq.includes("s2") && seq.length === 1) {
      squatStageTracker.IMPROPER_SQUAT++;
      // incorrect += 1;
    } else if (squatStageTracker.INCORRECT_POSTURE) {
      squatStageTracker.IMPROPER_SQUAT++;
      // incorrect += 1;
    }
    squatStageTracker.seq = [];
    squatStageTracker.INCORRECT_POSTURE = false;
}




  // 라운드 바뀔 시 운동이 바뀌는 이벤트 // 운동이 바뀐 후에는, 포즈 모델이 불러와져야 한다.
  useEffect(() => {
    // 처음에 들어왔을 때(라운드가 0일 떄), 실행해준다(처음 실행)
    if (nowRound === 0) {
      console.log('비디오 시작합니다.');
      // setSelectedExercise(props.exerciseForRound[0]);
      console.log(props.exerciseForRound[0]);
      // console.log(selectedExercise);
      console.log('현재 라운드')
      console.log(nowRound);
      console.log('외부에서의 라운드');
      console.log(props.currentRound);
      // 해당 라운드 운동으로 포즈모델 불러오기
      initializeModel();

    } else if (nowRound !== 0 && nowRound < props.roundWeight.length) {
      // 처음 라운드가 아닐 때에 & 라운드가 남아있을 때 실행
      console.log('라운드 변경!');
      console.log(nowRound);
      console.log('외부에서의 라운드');
      console.log(props.currentRound);

      // props.updateEachRoundCount(nowRound, count);
      // props.updateMyCombatPower(nowRound, count, props.roundWeight[(nowRound) - 1])

      // props.eachRoundCount[(nowRound) - 1] = count;
      // props.myCombatPower[(nowRound) - 1] = count * props.roundWeight[(nowRound) - 1];

      setCount(0);
      props.ChangeCount(0);

      console.log('카운트는 그대로 남아있나용?');
      console.log(props.eachRoundCount);

      const nextExercise = props.exerciseForRound[nowRound];
      // setSelectedExercise(nextExercise);
      console.log('운동도 변경!');
      console.log(props.exerciseForRound[nowRound])
      // console.log(selectedExercise);
      // props.ChangeCount(0);
      // document.querySelector(".count-box > p").innerText = `숫자 : ${count}`;

      // 해당 라운드 운동으로 포즈모델 불러오기
      // initializeModel(props.exerciseForRound[nowRound]);

    } else if (nowRound === props.roundWeight.length) {
      // 마지막 운동 후 실행
      console.log('마지막 라운드 끝!');
      console.log(nowRound);
      console.log('마지막으로 카운트는 그대로 남아있나용?');
      console.log(props.eachRoundCount);
      // props.eachRoundCount[(nowRound) - 1] = count;
      // props.myCombatPower[(nowRound) - 1] = count * props.roundWeight[(nowRound) - 1];
    }

  }, [nowRound])


  // 위에서 라운드가 바뀌면 내부에 있는 라운드도 바꿔준다!
  useEffect(() => {
    console.log('위에 라운드가 바뀌었다!');
    console.log(props.currentRound);

    setnowRound(props.currentRound);
    console.log('아래도 바꿔야지');
    console.log(nowRound);
    console.log('이건이쪽 카운트');
    console.log(count);
    console.log('이건 위쪽 카운트');
    console.log(props.countPower);
    props.updateEachRoundCount(props.currentRound - 1, props.countPower);
    // props.updateMyCombatPower(props.currentRound, count, props.roundWeight[(props.currentRound) - 1])

    changeSelectedExercise(props.currentRound);

    console.log(props.eachRoundCount)

  }, [props.currentRound])


  // 포즈 모델을 부르는 함수
  const initializeModel = async () => {
    console.log('포즈 모델을 불러옵니다.');
    if (OpenViduVideo) {
      await tf.setBackend("webgl");
      await tf.ready();
      const videoElement = document.querySelector("#myVideo>video");
      if (videoElement) {
        if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          await makeModel(videoElement);
        } else {
          // 비디오 메타데이터가 아직 로드되지 않은 경우, 메타데이터가 로드될 때까지 기다림
          videoElement.addEventListener('loadedmetadata', async () => {
            await makeModel(videoElement);
          });
        }
      }
    }
  };


  // // 운동 바꾸는 이벤트
  // const handleExerciseChange = (e) => {
  //   console.log(e.target.value);
  //   setSelectedExercise(e.target.value);
  //   setCount(0);
  //   // props.ChangeCount(0);
  //   document.querySelector(".count-box > span").innerText = `Count: ${count}`;
  // };

  // useEffect(() => {
  //   // 운동 종류에 따라 알림 내용 다르게 하기
  //   if (selectedExercise === 'jumpingJack') {
  //     document.querySelector(".warning > p").innerText = `전신이 다 보이도록 멀리 떨어져주세요!`;
  //   } else if (selectedExercise === 'lunge') {
  //     document.querySelector(".warning > p").innerText = `측면이 다 보이도록 멀리 떨어져주세요!`;
  //   } else if (selectedExercise === 'default') {
  //     document.querySelector(".warning > p").innerText = `카메라에 잘 보이게 서주세요!`;
  //   }


  //   const initializeModel = async () => {
  //     if (OpenViduVideo) {
  //       await tf.setBackend("webgl");
  //       await tf.ready();
  //       const videoElement = document.querySelector("#myVideo>video");
  //       if (videoElement) {
  //         if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
  //           await makeModel(videoElement);
  //         }
  //       }
  //     }
  //   };

  //   initializeModel();
  // }, [selectedExercise]);

  // useEffect(() => {
  //   props.ChangeCount(count)
  //   console.log(`숫자ㅏ 올라가요!!!   ${count}`)
  // }, [count])

  const getNicknameTag = () => {
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {/* <div>
        <select name="select" id="" onChange={handleExerciseChange}>
          <option value="default">운동을 선택해주세요.</option>
          <option value="jumpingJack">팔벌려뛰기</option>
          <option value="lunge">런지</option>
        </select>
      </div> */}
      {props.streamManager !== undefined ? (
        <div className="streamcomponent-self" id="myVideo">
          <OpenViduVideo streamManager={props.streamManager} />
          <div className='self-name'>
            <p>{getNicknameTag()}</p>
            {/* <p>닉네임 : {getNicknameTag()}</p> */}
            {/* <p>현재 운동 : { props.exerciseForRound[props.currentRound] }</p> */}
          </div>
          <div className="count-box">
            {/* <p> Count: {count}</p> */}
<<<<<<< HEAD
            <p> ⚔️ {props.myTotalCombatPower} </p>
            {/* <span>숫자 : { props.eachRoundCount[props.currentRound] }</span> */}
=======
            <p> 전투력 : {props.myTotalCombatPower} </p>
            <span>숫자 : {props.eachRoundCount[props.currentRound]}</span>
>>>>>>> 318a791593db53b167acc06bdb487609e4d9a957
          </div>
          {!bodyState && (
            <div className="warning">
              <p>전신이 다 보이도록 멀리 떨어져주세요!</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SelfVideo;
