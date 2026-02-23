'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 shadow-sm transition-transform group-hover:scale-105 active:scale-95">
                            {/* 태양 모양 로고 (SVG) */}
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-sm"
                            >
                                <circle cx="12" cy="12" r="4" fill="white" fillOpacity="0.2" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 6.34l-1.41 1.41" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                            쨍하고
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/companies" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                        업체 찾기
                    </Link>
                    <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                        대시보드
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        로그인
                    </Link>
                </div>
            </div>
        </header>
    );
}
