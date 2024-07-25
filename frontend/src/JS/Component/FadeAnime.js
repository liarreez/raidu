import React from "react";
import { motion } from "framer-motion";

const Wrapper = ({ children, ...rest }) => {
  const pageEffect = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.7 }}
      variants={pageEffect}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Wrapper;
