import React from "react";
import { motion } from "framer-motion";

const SpringAnime = ({ children, ...rest }) => {
  return (
    <motion.div
      initial={{ y: '60%' }} // 시작 위치를 오른쪽으로 설정
      animate={{ y: 0 }} // 최종 위치를 왼쪽으로 설정
      transition={{
        type: "spring",
        stiffness: 50, // 스프링의 강도를 설정
        damping: 5, // 스프링의 감쇠를 설정
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default SpringAnime;
