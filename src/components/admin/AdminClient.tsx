'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Company {
    id: string;
    company_name: string;
    headquarters_address: string;
    is_verified: boolean;
    created_at: string;
}

export default function AdminClient() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchAllCompanies() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('company_profiles')
                .select('id, company_name, headquarters_address, is_verified, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCompanies(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllCompanies();
    }, []);

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('company_profiles')
                .update({ is_verified: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // UI 즉시 업데이트
            setCompanies(prev => prev.map(c =>
                c.id === id ? { ...c, is_verified: !currentStatus } : c
            ));
        } catch (err: any) {
            alert('상태 변경 실패: ' + err.message);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">데이터 로드 중...</div>;

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1 font-medium">업체 입점 승인 및 관리 시스템</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Partners</span>
                        <p className="text-xl font-black text-blue-600">{companies.length}</p>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium">
                        ⚠️ 에러 발생: {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
                                <th className="px-6 py-4">업체명 / 주소</th>
                                <th className="px-6 py-4">등록일</th>
                                <th className="px-6 py-4">상태</th>
                                <th className="px-6 py-4 text-center">동작</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-5">
                                        <Link href={`/companies/${company.id}`}>
                                            <div className="font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors cursor-pointer inline-block decoration-blue-200 hover:underline underline-offset-4">
                                                {company.company_name}
                                            </div>
                                        </Link>
                                        <div className="text-xs text-slate-400 mt-1 font-medium">{company.headquarters_address}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-semibold text-slate-600">
                                            {new Date(company.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {company.is_verified ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                                                승인됨
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                                                대기중
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => toggleApproval(company.id, company.is_verified)}
                                            className={`px-5 py-2 rounded-xl text-sm font-black transition-all transform active:scale-95 shadow-md ${company.is_verified
                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white ring-1 ring-rose-200'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
                                                }`}
                                        >
                                            {company.is_verified ? '승인 취소' : '승인하기'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {companies.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-bold">등록된 업체가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
