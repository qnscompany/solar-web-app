'use client';

import React from 'react';

const BankView = () => {
    return (
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#FEF9C3" />
                    <stop offset="100%" stopColor="#F0FDF4" />
                </radialGradient>
            </defs>
            <rect x="0" y="0" width="400" height="300" rx="30" fill="url(#grad1)" />

            {/* Phone Mockup */}
            <rect x="125" y="30" width="150" height="240" rx="25" fill="#1E293B" />
            <rect x="135" y="45" width="130" height="210" rx="15" fill="white" />

            {/* App UI */}
            <text x="200" y="80" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="sans-serif">○○은행</text>
            <rect x="150" y="100" width="100" height="1" fill="#E2E8F0" />

            <text x="200" y="140" textAnchor="middle" fill="#64748B" fontSize="14" fontWeight="500" fontFamily="sans-serif">태양광 발전 수익</text>
            <text x="200" y="185" textAnchor="middle" fill="#22C55E" fontSize="22" fontWeight="900" fontFamily="sans-serif">+1,500,000원</text>

            <text x="200" y="230" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">2025.07.15</text>

            {/* Floating Coins */}
            <g className="animate-coin-1">
                <circle cx="80" cy="180" r="15" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
                <text x="80" y="185" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="900">₩</text>
            </g>
            <g className="animate-coin-2">
                <circle cx="320" cy="120" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
                <text x="320" y="125" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="900">₩</text>
            </g>
            <g className="animate-coin-3">
                <circle cx="330" cy="220" r="14" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
                <text x="330" y="225" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="900">₩</text>
            </g>

            <style jsx>{`
        @keyframes floatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-coin-1 { animation: floatUp 3s ease-in-out infinite; }
        .animate-coin-2 { animation: floatUp 4s ease-in-out infinite 0.5s; }
        .animate-coin-3 { animation: floatUp 3.5s ease-in-out infinite 1s; }
      `}</style>
        </svg>
    );
};

export default BankView;
