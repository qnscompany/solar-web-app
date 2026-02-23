'use client';

import React from 'react';

const FamilyView = () => {
    return (
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="0" y="0" width="400" height="300" rx="30" fill="#ECFDF5" />

            {/* Background Roof/Panels */}
            <path d="M0 200 L150 120 L400 200 V300 H0 Z" fill="#F97316" opacity="0.3" />
            <rect x="100" y="150" width="80" height="50" rx="4" fill="#1E40AF" opacity="0.2" transform="skewY(-15)" />

            {/* Characters */}
            {/* Grandma */}
            <g transform="translate(260, 140)">
                <rect x="10" y="60" width="50" height="80" rx="20" fill="#F472B6" /> {/* Clothes */}
                <circle cx="35" cy="40" r="30" fill="#E8EDF2" /> {/* Hair */}
                <circle cx="35" cy="45" r="22" fill="#FFDBAC" /> {/* Face */}
                <path d="M25 45 Q35 55 45 45" stroke="#475569" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
                <path d="M22 40 Q25 35 28 40" stroke="#475569" strokeWidth="1.5" /> {/* Eye */}
                <path d="M42 40 Q45 35 48 40" stroke="#475569" strokeWidth="1.5" /> {/* Eye */}
                {/* Arm pointing toward panels */}
                <path d="M10 90 L-40 60" stroke="#FFDBAC" strokeWidth="12" strokeLinecap="round" className="animate-point" />
            </g>

            {/* Child */}
            <g transform="translate(180, 180)">
                <rect x="10" y="40" width="45" height="60" rx="15" fill="#60A5FA" /> {/* Clothes */}
                <circle cx="32" cy="25" r="25" fill="#4B2C20" /> {/* Hair */}
                <circle cx="32" cy="30" r="20" fill="#FFDBAC" /> {/* Face */}
                <path d="M22 30 Q32 40 42 30" stroke="#475569" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
                <path d="M20 25 Q24 20 28 25" stroke="#475569" strokeWidth="1.5" /> {/* Eye */}
                <path d="M36 25 Q40 20 44 25" stroke="#475569" strokeWidth="1.5" /> {/* Eye */}
            </g>

            {/* Speech Bubble */}
            <g transform="translate(40, 100)" className="animate-bounce-slow">
                <rect x="0" y="0" width="180" height="50" rx="25" fill="#FEF08A" />
                <path d="M150 50 L160 70 L175 50 Z" fill="#FEF08A" />
                <text x="90" y="32" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="900" fontFamily="sans-serif">전기요금이 거의 안 나와요!</text>
            </g>

            <style jsx>{`
        @keyframes point { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-5deg); } }
        .animate-point { transform-origin: 10px 90px; animation: point 2s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
      `}</style>
        </svg>
    );
};

export default FamilyView;
