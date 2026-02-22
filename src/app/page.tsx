'use client';

import Link from 'next/link';
import {
    ShieldCheck,
    MapPin,
    AlertTriangle,
    TrendingDown,
    UserX,
    CheckCircle2,
    ArrowRight,
    Sun
} from 'lucide-react';

export default function MarketingLandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-200">
                            <Sun className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-black tracking-tight uppercase">{"쨍하고"}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors">{"로그인"}</Link>
                        <Link href="/companies" className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-md">{"무료 비교"}</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black mb-6">
                            <MapPin className="w-3 h-3" /> {"우리 동네 업체 매칭 1위"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            {"태양광 시공, 타지역 업체에 맡기시겠습니까?"}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 font-medium">
                            {"우리 동네 검증된 시공업체만 모았습니다. 시공능력, A/S, 평판을 한눈에 비교하세요."}
                        </p>
                        <Link href="/companies" className="group inline-flex items-center gap-3 px-8 py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all">
                            {"우리 동네 업체 비교하기"}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="bg-slate-100 rounded-[40px] p-4 shadow-2xl">
                            <div className="bg-white rounded-[32px] overflow-hidden relative aspect-[4/3] flex items-center justify-center border border-slate-200">
                                <div className="absolute bg-orange-500 text-white px-6 py-4 rounded-3xl shadow-2xl font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-6 h-6" /> {"우리지역 업체 검증 완료"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-24 bg-slate-900 text-white text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-16">
                        {"불법 하도급, 뻥튀기 견적, A/S 문제... 아직도 걱정되시나요?"}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/5 p-10 rounded-[32px]">
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto"><UserX /></div>
                            <h3 className="text-xl font-black mb-4">{"불투명한 하도급"}</h3>
                            <p className="text-slate-400 font-medium">{"계약과 다른 시공 업체 문제, 플랫폼이 철저히 관리합니다."}</p>
                        </div>
                        <div className="bg-white/5 p-10 rounded-[32px]">
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto"><TrendingDown /></div>
                            <h3 className="text-xl font-black mb-4">{"과도한 견적 차이"}</h3>
                            <p className="text-slate-400 font-medium">{"객관적인 견적 비교 데이터로 바가지 요금 걱정을 덜어드립니다."}</p>
                        </div>
                        <div className="bg-white/5 p-10 rounded-[32px]">
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto"><AlertTriangle /></div>
                            <h3 className="text-xl font-black mb-4">{"사후 관리 불안"}</h3>
                            <p className="text-slate-400 font-medium">{"업체가 사라져도 안심할 수 있는 보증 시스템을 확인하세요."}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-16 text-center text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center gap-8 border-b border-white/5 pb-12 mb-12">
                        <div className="flex items-center gap-2">
                            <Sun className="text-orange-500 w-8 h-8" />
                            <span className="text-2xl font-black tracking-tight uppercase">{"쨍하고"}</span>
                        </div>
                        <Link href="/companies" className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 transition-all">
                            {"무료 비교 시작하기"}
                        </Link>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{"© 2026 ZzangHago Inc. All rights reserved."}</p>
                </div>
            </footer>
        </div>
    );
}
