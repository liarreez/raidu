import React, { useState, useEffect } from 'react';
import '../../CSS/Timer.css'

// 휴식시간 타이머를 위한 컴포넌트

const TimerRest = ({ currentTime, timerActive}) => {
  const [count, setCount] = useState(currentTime);
  // const [isStart, setIsStart] = useState(false)

  useEffect(() => {
    if (timerActive) {
      setCount(currentTime);
      // setIsStart(true)
    }
  }, [currentTime, timerActive]);

  useEffect(() => {
    if (!timerActive || count <= 0) return;

    const id = setInterval(() => {
      setCount(prevCount => Math.max(prevCount - 1, 0));
    }, 1000);

    // if (count === 0) {
    //   clearInterval(id);
    // }

    return () => clearInterval(id);
  }, [count, timerActive]);

  useEffect(() => {
    if (count === 0 && timerActive) {
      // setIsStart(false)
      setCount(0)
    }
  }, [count, timerActive])
  
  const progress = (currentTime > 0) ? (count / currentTime) * 100 : 0;

  return (
    <div className='time-bar'>
      <div className='time-progress'>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: 'orange',
          }}
        />
      </div>
      <div className='time-number'>
        <span>{count}</span>
      </div>
    </div>
  );
};

export default TimerRest;