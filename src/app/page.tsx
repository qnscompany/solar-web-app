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
    Sun,
    Star,
    Quote
} from 'lucide-react';
import SolarCarousel from '@/components/solar-carousel/SolarCarousel';

export default function MarketingLandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation (Sticky Navbar를 레이아웃에서 사용하므로 여기서는 제거하거나 통일) */}
            {/* layout.tsx에서 상시 노출되는 Navbar가 있으므로 중복을 피하기 위해 여기서는 제거하거나 투명하게 처리합니다. */}

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
                        <div className="flex flex-col gap-4">
                            <Link href="/companies" className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-yellow-400 text-slate-900 rounded-2xl font-black text-xl hover:bg-yellow-500 shadow-xl shadow-yellow-200 transition-all">
                                {"우리 동네 업체 무료 비교하기 →"}
                            </Link>
                            <p className="text-sm font-bold text-slate-400 ml-2">
                                {"※ 로그인 없이 바로 비교 가능합니다"}
                            </p>
                        </div>

                        {/* Trust Statistics Badges */}
                        <div className="mt-16 flex flex-wrap gap-4 md:gap-8 border-t border-slate-100 pt-10">
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"12개"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"입점 업체"}</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200 self-center hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"247건"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"누적 견적"}</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200 self-center hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"4.7점"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"평균 별점"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative w-full max-w-[500px] mx-auto">
                            <SolarCarousel />
                            {/* Verification Badge - Adjusted position to avoid overlap */}
                            <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-white hidden lg:flex items-center gap-4 z-20 animate-fade-in-up">
                                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-slate-900 font-black text-md leading-tight">{"100% 검증 완료"}</p>
                                    <p className="text-slate-500 text-xs font-bold">{"우리 지역 인증 업체만"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Target Separation Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {/* Consumer Card */}
                        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{"견적을 원하시나요?"}</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                {"충남 지역 최고의 시공업체들이 여러분의 견적을 기다리고 있습니다. 믿을 수 있는 가격을 확인하세요."}
                            </p>
                            <Link href="/companies" className="inline-flex items-center gap-2 text-blue-600 font-black hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                                {"무료 견적 시작하기"} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Company Card */}
                        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Sun className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{"업체 사장님이신가요?"}</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                {"'쨍하고'의 파트너가 되어 더 많은 고객을 만나보세요. 입점 및 인증 절차를 안내해 드립니다."}
                            </p>
                            <Link href="/register" className="inline-flex items-center gap-2 text-orange-600 font-black hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                                {"파트너 등록하기"} <ArrowRight className="w-5 h-5" />
                            </Link>
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
            <footer className="bg-slate-950 py-20 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start border-b border-white/10 pb-16 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Sun className="text-orange-500 w-8 h-8" />
                                <span className="text-2xl font-black tracking-tight uppercase">{"쨍하고"}</span>
                            </div>
                            <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
                                {"충남 지역 모든 시공업체를 한눈에.\n에너지공단 인증 업체만 엄선하여 무료 견적 비교 서비스를 제공합니다."}
                            </p>
                        </div>
                        <div className="flex flex-col md:items-end gap-6 text-sm font-bold">
                            <div className="flex gap-8 text-slate-300">
                                <Link href="/companies" className="hover:text-white transition-colors">{"업체 찾기"}</Link>
                                <Link href="/privacy" className="hover:text-white transition-colors">{"개인정보처리방침"}</Link>
                                <Link href="/terms" className="hover:text-white transition-colors">{"이용약관"}</Link>
                            </div>
                            <Link href="/companies" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-md hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20">
                                {"무료 비교 시작하기 →"}
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[13px] font-bold">
                        <p>{"© 2026 ZzangHago Inc. All rights reserved."}</p>
                        <p>{"태양광 정보 공유 플랫폼 쨍하고"}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
