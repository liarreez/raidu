import React, { useState, useEffect, useRef } from "react";

const Rerenderer = ({ children, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 관찰 중지
        }
      },
      { threshold: 0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect(); // 컴포넌트 언마운트 시 관찰 중지
      }
    };
  }, []);

  return (
    <div ref={ref} {...rest}>
      {isVisible && children}
    </div>
  );
};

export default Rerenderer;
