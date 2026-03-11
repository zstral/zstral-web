"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatableLightProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatableLight({ children, className }: AnimatableLightProps) {
  return (
    <motion.div
      className={className}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.60, 1] }}
    >
      {children}
    </motion.div>
  );
}
