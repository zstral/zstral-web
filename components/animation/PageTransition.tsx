"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const routes = ["/","/projects", "/about"];

let prevPath = "";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (prevPath === "") {
    prevPath = pathname;
  }

  const getRouteIndex = (path: string) => {
    const idx = routes.indexOf(path);
    return idx === -1 ? 9999 : idx;
  };

  const currentIdx = getRouteIndex(pathname);
  const prevIdx = getRouteIndex(prevPath);

  const direction = currentIdx < prevIdx ? -1 : 1;

useEffect(() => {
  prevPath = pathname;
}, [pathname]);

  const variants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: 100 * direction,
      filter: "blur(20px)",
    }),
    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: -100 * direction,
      filter: "blur(10px)",
    }),
  };

return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}