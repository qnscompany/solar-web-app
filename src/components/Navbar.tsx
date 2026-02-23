'use client';

import Link from 'next/link';
import { Sun } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-100 transition-transform group-hover:scale-105 active:scale-95">
                            <Sun className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl uppercase">
                            쨍하고
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex flex-1 items-center justify-center">
                    {/* TODO: 메인 메뉴 추가 예정 */}
                </nav>

                <div className="flex items-center">
                    <Link
                        href="/login"
                        className="rounded-lg px-3 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        시공사 로그인
                    </Link>
                </div>
            </div>
        </header>
    );
}
