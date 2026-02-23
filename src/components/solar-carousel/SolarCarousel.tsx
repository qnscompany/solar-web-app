'use client';

import React, { useState, useEffect } from 'react';
import TopDownView from './TopDownView';
import FrontView from './FrontView';
import FamilyView from './FamilyView';
import BankView from './BankView';

const SolarCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        <TopDownView key="topdown" />,
        <FrontView key="front" />,
        <FamilyView key="family" />,
        <BankView key="bank" />
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-[40px] bg-white shadow-xl">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex gap-3 mt-8">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 w-8' : 'bg-orange-200 hover:bg-orange-300'
                            }`}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SolarCarousel;
