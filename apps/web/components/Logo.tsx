'use client';

import React from 'react';
import './Logo.css';

export interface LogoProps {
    variant?: 'full' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({
    variant = 'full',
    size = 'md',
    className = '',
}) => {
    const sizeMap = {
        sm: { icon: 24, text: 16 },
        md: { icon: 32, text: 20 },
        lg: { icon: 48, text: 28 },
    };

    const { icon: iconSize, text: textSize } = sizeMap[size];

    return (
        <div className={`logo logo-${variant} logo-${size} ${className}`}>
            {/* Heart Icon with Cosmic Elements */}
            <svg
                className="logo-icon"
                width={iconSize}
                height={iconSize}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer glow */}
                <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary-light)" />
                        <stop offset="50%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                </defs>

                {/* Glow effect */}
                <circle cx="50" cy="50" r="45" fill="url(#glow)" />

                {/* Heart shape */}
                <path
                    d="M50 85 C25 65, 15 50, 15 35 C15 20, 25 15, 35 15 C42 15, 47 18, 50 23 C53 18, 58 15, 65 15 C75 15, 85 20, 85 35 C85 50, 75 65, 50 85 Z"
                    fill="url(#heartGradient)"
                    className="logo-heart"
                />

                {/* Stars */}
                <circle cx="30" cy="25" r="2" fill="var(--secondary)" className="logo-star" />
                <circle cx="70" cy="25" r="2" fill="var(--secondary)" className="logo-star" />
                <circle cx="50" cy="15" r="2.5" fill="var(--secondary-light)" className="logo-star" />

                {/* Moon crescent */}
                <path
                    d="M50 40 A8 8 0 1 0 50 56 A6 6 0 1 1 50 40 Z"
                    fill="var(--secondary-light)"
                    opacity="0.8"
                    className="logo-moon"
                />
            </svg>

            {variant === 'full' && (
                <span className="logo-text" style={{ fontSize: `${textSize}px` }}>
                    Guia do Coração
                </span>
            )}
        </div>
    );
};

Logo.displayName = 'Logo';
