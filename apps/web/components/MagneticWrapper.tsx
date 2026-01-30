"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

interface MagneticWrapperProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (default: 0.5)
}

export default function MagneticWrapper({
    children,
    className = "",
    strength = 0.5
}: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth movement (Magnetic effect)
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Apply strength factor
        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative inline-block touch-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.95 }} // Mobile/Touch feedback
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}
