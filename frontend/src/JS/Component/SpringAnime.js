import React from "react";
import { motion } from "framer-motion";

const SpringAnime = ({ children, from = "up", ...rest }) => {
  let initial;
  switch (from) {
    case "down":
      initial = { y: "-60%" };
      break;
    case "up":
      initial = { y: "60%" };
      break;
    case "right":
      initial = { x: "-60%" };
      break;
    case "left":
      initial = { x: "60%" };
      break;
    default:
      initial = { y: "60%" };
  }

  return (
    <motion.div
      initial={initial}
      animate={{ x: 0, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 6,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default SpringAnime;
