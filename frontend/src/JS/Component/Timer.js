import React, { useState, useEffect } from 'react';
import '../../CSS/Timer.css'

// 타이머를 위한 컴포넌트

const Timer = ({ currentTime, timerActive, ChangeCurrentTime }) => {
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
      ChangeCurrentTime(0)
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
            background: "linear-gradient(to right, #fefb72, #f0bb31)",
            transition: "1s linear"
          }}
        />
      </div>
      <div className='time-number-container'>
        <div className='time-number'>
          {count}
        </div>
      </div>
    </div>
  );
};

export default Timer;