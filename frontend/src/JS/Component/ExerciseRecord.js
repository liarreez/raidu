import React from "react";
import "../../CSS/ExerciseRecord.css"; // CSS 파일 임포트
import test from "../../Imgs/test.png"; // 기본 이미지
import jumpingJack from "../../Imgs/jumpingJack.png"; // 운동 이미지 예시
import lunge from "../../Imgs/lunge.png";
import pushUp from "../../Imgs/pushUp.png";
import squat from "../../Imgs/squat.png";
import situp from "../../Imgs/situp.png";

// 운동명에 따른 이미지 매핑 객체
const exerciseImages = {
  jumpingJack: jumpingJack,
  lunge: lunge,
  pushUp: pushUp,
  squat: squat,
  situp: situp,
};

const ExerciseRecord = ({ record }) => {
  return (
    <div className="record-item">
      <div className="record-header">
        <div>
          <span>{record.endTime.slice(11, 16)}</span> {/* 00:00 포맷으로 시간 표기 */}
        </div>
        <div className="record-popcount">
          <span>👥 {record.participantsCount}</span>
        </div>
      </div>
      <div className="record-content">
        <div className="record-exercises">
          {record.roundRecordResponseDtos.map((round, index) => (
            <div key={index} className="exercise-item">
              {/* 운동명에 해당하는 이미지가 있으면 그 이미지, 없으면 test.png 사용 */}
              <img
                src={exerciseImages[round.name] || test}
                alt={round.name}
                className="exercise-image"
              />
              <span className="exercise-count">{round.exerciseCount}회</span>
            </div>
          ))}
        </div>
        <div className="record-combat-power">
          <div>
            <span>
              ⚔️ {record.personalCombatPower} / {record.totalCombatPower}
            </span>
          </div>
          <div>
            <span>
              ({Math.round((record.personalCombatPower / record.totalCombatPower) * 100)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseRecord;
