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
import SolarCalculator from '@/components/SolarCalculator';

/**
 * 마케팅 랜딩 페이지 컴포넌트
 * 서비스의 가치를 전달하고 사용자의 전환(견적 요청)을 유도하는 플랫폼의 첫 관문입니다.
 */
export default function MarketingLandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* -----------------------------------------------------------------
                [SECTION] Hero Section
                - 방문자의 첫 시선을 사로잡는 강력한 헤드라인과 CTA 제공
                - 신뢰할 수 있는 데이터(배지)와 시각적 요소(Carousel) 배치
            ----------------------------------------------------------------- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black">
                                <MapPin className="w-3 h-3" /> {"우리 동네 업체 매칭 1위"}
                            </div>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black">
                                <ShieldCheck className="w-3 h-3" /> {"국가 인증 업체"}
                            </div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black">
                                <CheckCircle2 className="w-3 h-3" /> {"에너지공단 참여기업"}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            {"태양광 시공, 타지역 업체에 맡기시겠습니까?"}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 font-medium">
                            {"우리 동네 검증된 시공업체만 모았습니다. 시공능력, A/S, 평판을 한눈에 비교하세요."}
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/companies" className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#FBBF24] text-slate-900 rounded-2xl font-black text-xl hover:bg-yellow-500 shadow-xl shadow-yellow-200 transition-all">
                                {"30초 만에 우리 동네 업체 찾기 →"}
                            </Link>
                            <p className="text-sm font-bold text-slate-500 ml-2">
                                {"로그인 없이 바로 가능 · 완전 무료"}
                            </p>
                        </div>

                        {/* Trust Statistics Badges */}
                        <div className="mt-16 flex flex-wrap gap-4 md:gap-8 border-t border-slate-100 pt-10">
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"12개"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"전국 입점업체"}</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200 self-center hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"100%"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"직접 검증"}</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200 self-center hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-black text-slate-900">{"무료"}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400">{"견적 비교"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative w-full max-w-[500px] mx-auto">
                            <SolarCarousel />

                        </div>
                    </div>
                </div>
            </section>

            {/* -----------------------------------------------------------------
                [SECTION] Solar Calculator
                - 40~60대 사용자를 위한 초간단 용량 계산기
            ----------------------------------------------------------------- */}
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-white p-8 md:p-12 relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                                <Sun className="w-6 h-6 fill-current" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                {"내 집에 딱 맞는 용량은?"}
                            </h2>
                        </div>

                        <SolarCalculator />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
            </section>

            {/* Target Separation (Consumer / Company) */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Consumer Card */}
                        <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{"견적을 원하시나요?"}</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                {"지역 최고의 시공업체들이 여러분의 견적을 기다리고 있습니다. 믿을 수 있는 가격을 확인하세요."}
                            </p>
                            <Link href="/companies" className="inline-flex items-center gap-2 text-blue-600 font-black hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                                {"무료 견적 시작하기"} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Company Card */}
                        <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
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

            {/* -----------------------------------------------------------------
                [SECTION] Testimonials
                - 실제 고객 후기 3개 (신뢰도 향상)
            ----------------------------------------------------------------- */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{"이웃들의 실제 설치 후기"}</h2>
                        <p className="text-slate-500 font-bold">{"지역 주민들이 직접 남겨주신 소중한 경험입니다."}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: '김○숙', loc: '당진시 합덕읍', cap: '5kW', stars: 5, text: "타지역 업체한테 견적 받았다가 바가지 쓸 뻔했는데, 여기서 비교하고 우리 동네 업체 찾았어요. 설치 후 전기세가 확 줄었습니다." },
                            { name: '이○철', loc: '서산시 대산읍', cap: '10kW', stars: 5, text: "A/S 연락했더니 다음날 바로 왔어요. 서울 업체였으면 절대 이러지 못했을 거예요." },
                            { name: '박○순', loc: '아산시 둔포면', cap: '3kW', stars: 4, text: "태양광 완전 처음인데 상담부터 설치까지 친절하게 설명해줬어요. 계약서도 꼼꼼히 확인해주더라고요." }
                        ].map((review, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black text-lg">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{review.name} 고객님</p>
                                        <p className="text-xs font-bold text-slate-400">{review.loc} | {review.cap}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className={`w-4 h-4 ${j < review.stars ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                                <p className="text-slate-700 font-bold leading-relaxed italic">
                                    <Quote className="w-5 h-5 text-slate-200 mb-2" />
                                    {review.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -----------------------------------------------------------------
                [SECTION] Operator Message
                - 로컬 운영자의 진정성을 담은 메시지
            ----------------------------------------------------------------- */}
            <section className="py-16 bg-[#FFFBEB]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed italic">
                        {"🌱 이 플랫폼은 충남 당진에 살고 있는 주민이 직접 만들었습니다.\n우리 동네 이웃들이 태양광 시공으로 피해 보는 일이 없도록,\n직접 발로 뛰어 검증한 업체만 입점시키겠습니다."}
                    </p>
                    <p className="mt-8 text-slate-500 font-black tracking-widest uppercase">
                        {"— 플랫폼 운영자 드림"}
                    </p>
                </div>
            </section>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
                <Link href="/companies" className="flex items-center justify-center w-full py-4 bg-[#FBBF24] text-slate-900 rounded-2xl font-black text-lg shadow-2xl border-2 border-white">
                    {"지금 바로 무료 견격 받기 →"}
                </Link>
            </div>

            {/* -----------------------------------------------------------------
                [SECTION] Footer
                - 플랫폼 정보, 정책 링크, 법적 고지사항 포함
            ----------------------------------------------------------------- */}
            <footer className="bg-slate-950 py-20 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start border-b border-white/10 pb-16 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Sun className="text-orange-500 w-8 h-8" />
                                <span className="text-2xl font-black tracking-tight uppercase">{"쨍하고"}</span>
                            </div>
                            <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
                                {"내 주변 시공업체를 한눈에. 한국에너지공단 인증 업체만 엄선하여\n무료 견적 비교 서비스를 제공합니다."}
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
                        <p>{"© 2026 Zzaenghago Inc. All rights reserved."}</p>
                        <p>{"태양광 정보 공유 플랫폼 쨍하고"}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
