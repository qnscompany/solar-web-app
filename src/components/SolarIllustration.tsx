'use client';

import React from 'react';

const SolarIllustration = () => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-w-[400px]"
            >
                {/* Ground / Grass */}
                <rect x="40" y="40" width="320" height="320" rx="40" fill="#F0FDF4" />

                {/* Soft Shadow under the house */}
                <rect x="95" y="95" width="210" height="210" rx="10" fill="#E2E8F0" opacity="0.4" />

                {/* House Body from top */}
                <rect x="100" y="100" width="200" height="200" rx="8" fill="#FFEDD5" />

                {/* Roof (Gabled structure seen from top) */}
                {/* Left Slope */}
                <path d="M100 100 L200 100 L200 300 L100 300 Z" fill="#FB923C" />
                {/* Right Slope (Main) */}
                <path d="M200 100 L300 100 L300 300 L200 300 Z" fill="#F97316" />
                {/* Roof Ridge Line */}
                <line x1="200" y1="100" x2="200" y2="300" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />

                {/* Solar Panels on Right Slope (Ordered and Large) */}
                <g>
                    {/* Panel 1 */}
                    <rect x="220" y="120" width="60" height="70" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2" />
                    <line x1="220" y1="143" x2="280" y2="143" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                    <line x1="220" y1="166" x2="280" y2="166" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />

                    {/* Panel 2 */}
                    <rect x="220" y="210" width="60" height="70" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="2" />
                    <line x1="220" y1="233" x2="280" y2="233" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                    <line x1="220" y1="256" x2="280" y2="256" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                </g>

                {/* Shiny Sun - Top perspective floating nearby */}
                <g className="animate-sun-float">
                    <circle cx="340" cy="60" r="30" fill="#FBBF24" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <line
                            key={angle}
                            x1={340 + Math.cos((angle * Math.PI) / 180) * 40}
                            y1={60 + Math.sin((angle * Math.PI) / 180) * 40}
                            x2={340 + Math.cos((angle * Math.PI) / 180) * 55}
                            y2={60 + Math.sin((angle * Math.PI) / 180) * 55}
                            stroke="#FBBF24"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    ))}
                </g>

                {/* Simple tree/bush next to house for context */}
                <circle cx="80" cy="300" r="25" fill="#22C55E" />
                <circle cx="70" cy="285" r="15" fill="#4ADE80" />

            </svg>
            <style jsx>{`
        .animate-sun-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-5px, 5px); }
        }
      `}</style>
        </div>
    );
};

export default SolarIllustration;
