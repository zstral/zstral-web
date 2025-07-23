'use client'
import React, { useState, useRef, useEffect } from "react";

const VantaCanvas = ({ className = "w-full h-screen" }) => {
    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)
    useEffect(() => {
        if (typeof window !== "undefined" && window.VANTA && window.VANTA.NET && !vantaEffect) {
        setVantaEffect(window.VANTA.NET({
            el: myRef.current,
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
        }))
        }
        return () => {
        if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])
    return (
        <div ref={myRef} className={`${className}`}></div>
    )
}

export default VantaCanvas