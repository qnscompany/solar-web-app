'use client';

import React from 'react';

const TopDownView = () => {
    return (
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="0" y="0" width="400" height="300" rx="30" fill="#F0FDF4" />
            <rect x="100" y="50" width="200" height="200" rx="10" fill="#E2E8F0" opacity="0.4" transform="translate(5, 5)" />
            <rect x="100" y="50" width="200" height="200" rx="8" fill="#FFEDD5" />
            <path d="M100 50 L200 50 L200 250 L100 250 Z" fill="#FB923C" />
            <path d="M200 50 L300 50 L300 250 L200 250 Z" fill="#F97316" />
            <line x1="200" y1="50" x2="200" y2="250" stroke="#EA580C" strokeWidth="4" />
            <g>
                <rect x="220" y="70" width="60" height="70" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2" />
                <line x1="220" y1="93" x2="280" y2="93" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                <line x1="220" y1="116" x2="280" y2="116" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                <rect x="220" y="160" width="60" height="70" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2" />
                <line x1="220" y1="183" x2="280" y2="183" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                <line x1="220" y1="206" x2="280" y2="206" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
            </g>
            <g className="animate-sun-float">
                <circle cx="340" cy="50" r="25" fill="#FBBF24" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <line key={angle} x1={340 + Math.cos((angle * Math.PI) / 180) * 35} y1={50 + Math.sin((angle * Math.PI) / 180) * 35} x2={340 + Math.cos((angle * Math.PI) / 180) * 45} y2={50 + Math.sin((angle * Math.PI) / 180) * 45} stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                ))}
            </g>
            <circle cx="60" cy="240" r="20" fill="#22C55E" />
            <circle cx="50" cy="230" r="12" fill="#4ADE80" />
            <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0); } 50% { transform: translate(-3px,3px); } 100% { transform: translate(0,0); } }
        .animate-sun-float { animation: float 4s ease-in-out infinite; }
      `}</style>
        </svg>
    );
};

export default TopDownView;
