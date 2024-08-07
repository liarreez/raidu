import React, { useEffect, useState } from 'react';
import '../../CSS/TotalCombatPower.css'

// 총 전투력을 보여주는 프로그레스 바

const TotalCombatPower = ({
  label = '',
  backgroundColor = "#383a52",
  visualParts = [
    {
      percentage: "0%",
      color: "white"
    }
  ]
}) => {
  const [heights, setHeights] = useState(
    visualParts.map(() => {
      return 0;
    })
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setHeights(
        visualParts.map(item => {
          return item.percentage;
        })
      );
    });
  }, [visualParts]);

  return (
    <>
      <div className='total-combat-power-label'>{label}</div>
      <div
        className='total-combat-power-container'
        style={{
          backgroundColor
        }}
      >
        <div className='total-combat-power-background'>
          {visualParts.map((item, index) => (
            <div
              key={index}
              style={{
                height: heights[index],
                backgroundColor: item.color
              }}
              className='total-combat-power'
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TotalCombatPower;