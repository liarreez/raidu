import React, { useState, useEffect, useRef } from "react";
import '../../CSS/AnimatedNumber.css';

// Helper function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AnimatedNumber = ({ targetNumber, fontSize }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const duration = 1700; // 1초
    const stepTime = 20;
    const steps = duration / stepTime;
    const stepValue = (targetNumber - currentNumber) / steps;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentNumber((prevNumber) => {
        if (prevNumber >= targetNumber && stepValue > 0) {
          clearInterval(intervalRef.current);
          return targetNumber;
        } else if (prevNumber <= targetNumber && stepValue < 0) {
          clearInterval(intervalRef.current);
          return targetNumber;
        }
        return prevNumber + stepValue;
      });
    }, stepTime);

    return () => clearInterval(intervalRef.current);
  }, [targetNumber]);

  return (
    <div className="dynamic-wrapper">
      <div style={{ fontSize: `${fontSize}px` }} className="dynamic-number">
        {formatNumber(Math.round(currentNumber))}
      </div>
      <div className="dynamic-text">
        명의 유저들이 함께하고 있어요!
      </div>
    </div>
  );
};

export default AnimatedNumber;
