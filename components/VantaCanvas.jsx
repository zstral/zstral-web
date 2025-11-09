'use client'
import React, { useRef, useEffect } from "react";

const VantaCanvas = ({ className = "w-full h-screen" }) => {
  const vantaRef = useRef(null)
  const effectRef = useRef(null)

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.VANTA &&
      window.VANTA.NET &&
      !effectRef.current
    ) {
      effectRef.current = window.VANTA.NET({
        el: vantaRef.current,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff00c3,
        backgroundColor: 0x0,
        points: 20.00,
        maxDistance: 10.00,
        spacing: 14.00
      });
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className={className}></div>;
};

export default VantaCanvas;