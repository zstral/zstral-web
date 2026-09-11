"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

export const bubbleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 35,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
      mass: 0.7,
    },
  },
};

export interface BubbleEffectProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bubbleClassName?: string;
  index?: number;
  hoverScale?: number;
  hoverY?: number;
  tapScale?: number;
  enableFloating?: boolean;
  floatY?: number;
  floatDuration?: number;
  floatDelay?: number;
  floatRotate?: number;
  variants?: Variants;
}

export default function BubbleEffect({
  children,
  footer,
  className = "",
  bubbleClassName = "",
  index = 0,
  hoverScale = 1.22,
  hoverY = -8,
  tapScale = 0.92,
  enableFloating = true,
  floatY,
  floatDuration,
  floatDelay,
  floatRotate = 1.5,
  variants = bubbleVariants,
  ...props
}: BubbleEffectProps): React.JSX.Element {
  const calculatedDuration = floatDuration ?? 3 + (index % 4) * 0.6;
  const calculatedDelay = floatDelay ?? (index % 5) * 0.25;
  const calculatedFloatY = floatY ?? 4 + (index % 3) * 2;

  return (
    <motion.div
      variants={variants}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { type: "spring", stiffness: 450, damping: 10 },
      }}
      whileTap={{ scale: tapScale }}
      className={className}
      {...props}
    >
      {enableFloating ? (
        <motion.div
          animate={{
            y: [-calculatedFloatY, calculatedFloatY, -calculatedFloatY],
            rotate: [-floatRotate, floatRotate, -floatRotate],
          }}
          transition={{
            duration: calculatedDuration,
            delay: calculatedDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={bubbleClassName}
        >
          {children}
        </motion.div>
      ) : (
        <div className={bubbleClassName}>{children}</div>
      )}
      {footer}
    </motion.div>
  );
}
