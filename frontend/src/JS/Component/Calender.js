import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

const Calender = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const initialDate = new Date();
    initialDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    handleDateChange(initialDate);
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate); // 로컬 상태 업데이트
    const formattedDate = formatDate(selectedDate); // 날짜 포맷팅
    onDateChange(formattedDate); // 포맷된 날짜를 부모 컴포넌트로 전달
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange} // 날짜 변경 시 handleDateChange 호출
        value={date}
      />
    </div>
  );
};

export default Calender;
