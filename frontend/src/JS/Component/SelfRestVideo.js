import React, { useEffect, useState } from "react";
import OpenViduVideo from '../Component/OpenViduVideo';

import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import '../../CSS/SelfRestVideo.css'

// 휴식 시간에 보여질 작은 화면

const SelfRestVideo = (props) => {
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

  // let count = 0;
  let stageOfJumpingJack = "down";
  let stageOfLunge = "up";

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

    await detectModel(detector, video);
  };

  const detectModel = async (detector, video) => {
    const poses = await detector.estimatePoses(video);
    if (poses && poses.length > 0) {
      const pose = poses[0];
      processPose(pose);
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

  const processPose = (pose) => {
    if (isFullBodyVisible(pose)) {
      setBodyState(true);

      if (selectedExercise === "jumpingJack") {
        countingJumpingJack(pose);
      } else if (selectedExercise === "lunge") {
        countingLunge(pose);
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
    // count++;
    const newCount = count + 1;
    setCount(newCount);
    props.ChangeCount(newCount);
    document.querySelector(".count-box > p").innerText = `Count: ${count}`;
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

  // const [count, setCount] = useState(0);
  let count = 0;
  const setCount = (num) => {
    count = num;
  };
  const [bodyState, setBodyState] = useState(false);
  // const [jumpingJack, setJumpingJack] = useState(false)
  // const [lunge, setLunge] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState("");


  // 운동 바꾸는 이벤트
  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
    setCount(0);
    props.ChangeCount(0);
    document.querySelector(".count-box > p").innerText = `Count: ${count}`;
  };

  useEffect(() => {
    // 운동 종류에 따라 알림 내용 다르게 하기
    if (selectedExercise === 'jumpingJack') {
      document.querySelector(".warning > p").innerText = `전신이 다 보이도록 멀리 떨어져주세요!`;
    } else if (selectedExercise === 'lunge') {
      document.querySelector(".warning > p").innerText = `측면이 다 보이도록 멀리 떨어져주세요!`;
    } else if (selectedExercise === 'default') {
      document.querySelector(".warning > p").innerText = `카메라에 잘 보이게 서주세요!`;
    }


    const initializeModel = async () => {
      if (OpenViduVideo) {
        await tf.setBackend("webgl");
        await tf.ready();
        const videoElement = document.querySelector("#myRestVideo>video");
        if (videoElement) {
          if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            await makeModel(videoElement);
          }
        }
      }
    };

    initializeModel();
  }, [selectedExercise]);

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
        <div className="streamcomponent-self-rest" id="myRestVideo">
          <OpenViduVideo streamManager={props.streamManager} />
          <div className='self-rest-name'>
            <p>{getNicknameTag()}</p>
          </div>
          <div className="count-rest-box">
            {/* <p> Count: {count}</p> */}
            <p> count : 0 </p>
          </div>
          {!bodyState && (
            <div className="warning-rest">
              <p>전신이 다 보이도록 멀리 떨어져주세요!</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SelfRestVideo;
