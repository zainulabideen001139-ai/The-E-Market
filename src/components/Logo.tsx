import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8', iconOnly = false, light = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium Emblem Symbol: Golden Monogram / Geometric Crown */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto aspect-square overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA73" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#9E7A3B" />
          </linearGradient>
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#DFBA73" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Geometric Interlocking Double Triangular Arch / Crown Monogram */}
        <path
          d="M50 15 L85 80 L67 80 L50 48 L33 80 L15 80 Z"
          fill="url(#goldGradient)"
          filter="url(#subtleGlow)"
        />
        <path
          d="M50 38 L65 67 L35 67 Z"
          fill={light ? '#0A0A0A' : '#FFFFFF'}
        />
        <circle cx="50" cy="53" r="5" fill="url(#goldGradient)" />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col tracking-wider leading-none">
          <span
            className={`font-semibold text-lg md:text-xl tracking-[0.2em] font-sans ${
              light ? 'text-black' : 'text-white'
            }`}
          >
            AVENZO
          </span>
          <span
            className={`text-[8px] md:text-[9px] tracking-[0.38em] font-medium font-sans uppercase mt-0.5 ${
              light ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            Official Store
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
