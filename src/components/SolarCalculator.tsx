'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

type BillRange = '1to3' | '3to10' | 'over10';
type Location = 'veranda' | 'house' | 'factory';

export default function SolarCalculator() {
    const [bill, setBill] = useState<BillRange>('3to10');
    const [loc, setLoc] = useState<Location>('house');

    const calculateResult = () => {
        if (loc === 'veranda') {
            return { cap: '1kW 이하', saving: '월 1~3만원' };
        }
        if (loc === 'house') {
            return { cap: '3kW', saving: '월 3만원' };
        }
        if (loc === 'factory') {
            return { cap: '30kW 이상', saving: '상담 필요' };
        }
        return { cap: '3kW', saving: '월 3만원' };
    };

    const result = calculateResult();

    return (
        <div className="space-y-10">
            {/* Step 1: Monthly Bill */}
            <div>
                <p className="text-lg font-bold text-slate-700 mb-4 tracking-tight">
                    {"1. 월 전기요금이 얼마인가요?"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: '1to3', label: '1~3만원' },
                        { id: '3to10', label: '3~10만원' },
                        { id: 'over10', label: '10만원 이상' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setBill(item.id as BillRange)}
                            className={`py-4 px-2 rounded-2xl font-black text-sm transition-all border-2 ${bill === item.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2: Location */}
            <div>
                <p className="text-lg font-bold text-slate-700 mb-4 tracking-tight">
                    {"2. 설치 공간은 어디인가요?"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: 'veranda', label: '아파트 베란다' },
                        { id: 'house', label: '단독주택 지붕' },
                        { id: 'factory', label: '상가/공장' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setLoc(item.id as Location)}
                            className={`py-4 px-2 rounded-2xl font-black text-sm transition-all border-2 ${loc === item.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Display */}
            <div className="bg-yellow-50 rounded-[32px] p-8 border border-yellow-100 text-center">
                <p className="text-slate-500 font-bold mb-4 text-sm tracking-widest uppercase">{"예상 분석 결과"}</p>
                <div className="mb-6">
                    <p className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                        {"약 "}
                        <span className="text-orange-600 underline decoration-4 underline-offset-4">{result.cap}</span>
                        {" 시스템이 적합합니다."}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-slate-600 mt-4 flex items-center justify-center gap-2">
                        {result.saving} 절감 예상 <Sparkles className="text-yellow-500 w-5 h-5 fill-current" />
                    </p>
                </div>

                <div className="mb-8">
                    <p className="text-xs font-bold text-slate-400">
                        {"※ 상담 후 예상 용량과 예상 절감액은 달라질 수 있습니다."}
                    </p>
                </div>

                <Link href="/companies" className="inline-flex items-center justify-center gap-3 w-full max-w-sm py-5 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-200">
                    {"지금 바로 무료 견적 받기"} <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
