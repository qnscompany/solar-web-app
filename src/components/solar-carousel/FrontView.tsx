'use client';

import React from 'react';

const FrontView = () => {
    return (
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="0" y="0" width="400" height="300" rx="30" fill="#FEF9C3" opacity="0.5" />

            {/* Ground */}
            <rect x="20" y="240" width="360" height="40" rx="20" fill="#BBF7D0" />

            {/* House Body */}
            <rect x="100" y="140" width="200" height="110" fill="#FFEDD5" stroke="#FED7AA" strokeWidth="2" />
            <rect x="120" y="170" width="40" height="40" rx="4" fill="white" stroke="#FED7AA" strokeWidth="2" />
            <rect x="220" y="170" width="60" height="80" rx="4" fill="#FB923C" />
            <circle cx="270" cy="210" r="3" fill="white" />

            {/* Roof */}
            <path d="M80 140 L200 60 L320 140 Z" fill="#F97316" stroke="#EA580C" strokeWidth="4" strokeLinejoin="round" />

            {/* Solar Panels on Roof */}
            <g transform="rotate(-33, 200, 100)">
                <rect x="150" y="85" width="45" height="30" rx="2" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1" />
                <rect x="205" y="85" width="45" height="30" rx="2" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1" />
                <rect x="150" y="120" width="45" height="30" rx="2" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1" />
                <rect x="205" y="120" width="45" height="30" rx="2" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1" />
            </g>

            {/* Sun */}
            <g className="animate-sun-pulse">
                <circle cx="340" cy="60" r="30" fill="#FBBF24" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                    <line key={a} x1={340 + Math.cos(a * Math.PI / 180) * 40} y1={60 + Math.sin(a * Math.PI / 180) * 40} x2={340 + Math.cos(a * Math.PI / 180) * 55} y2={60 + Math.sin(a * Math.PI / 180) * 55} stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                ))}
            </g>

            {/* Tree */}
            <rect x="55" y="210" width="10" height="30" fill="#92400E" />
            <circle cx="60" cy="190" r="25" fill="#22C55E" />

            <style jsx>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); transform-origin: 340px 60px; } 50% { opacity: 0.8; transform: scale(1.05); transform-origin: 340px 60px; } }
        .animate-sun-pulse { animation: pulse 3s ease-in-out infinite; }
      `}</style>
        </svg>
    );
};

export default FrontView;
