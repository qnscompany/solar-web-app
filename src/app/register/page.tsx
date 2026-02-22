'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            alert('회원가입 신청이 완료되었습니다. 이메일을 확인해 주세요!');
            router.push('/login');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">업체 회원가입</h1>
                    <p className="text-gray-500">솔라 플랫폼의 파트너가 되어보세요</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">이메일 주소</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="example@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
                    >
                        {loading ? '처리 중...' : '가입하기'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className="text-blue-600 font-bold hover:underline">
                        로그인
                    </Link>
                </p>
            </div>
        </main>
    );
}
