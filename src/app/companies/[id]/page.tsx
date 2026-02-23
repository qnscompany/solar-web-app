'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import LeadRequestForm from '@/components/LeadRequestForm';
import { Star, Quote } from 'lucide-react';

interface CompanyDetail {
    id: string;
    company_name: string;
    service_areas: string[];
    capabilities: {
        cumulative_capacity_mw: number;
        construction_capacity_value: number;
        warranty_period_years: number;
        technician_count: number;
    };
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCompany() {
            try {
                const { data, error } = await supabase
                    .from('company_profiles')
                    .select(`
                        id,
                        company_name,
                        service_areas,
                        capabilities:company_capabilities (
                            cumulative_capacity_mw,
                            construction_capacity_value,
                            warranty_period_years,
                            technician_count
                        )
                    `)
                    .eq('id', id)
                    .maybeSingle();

                if (error) throw error;

                if (!data) throw new Error('업체 정보를 찾을 수 없습니다.');

                setCompany({
                    ...data,
                    capabilities: (Array.isArray(data.capabilities) ? data.capabilities[0] : data.capabilities) || {
                        cumulative_capacity_mw: 0,
                        construction_capacity_value: 0,
                        warranty_period_years: 0,
                        technician_count: 0
                    }
                } as CompanyDetail);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCompany();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-xl font-medium">상세 정보를 불러오는 중...</div>;
    if (error || !company) return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">데이터를 불러오지 못했습니다: {error || '업체를 찾을 수 없습니다.'}</p>
            <Link href="/companies" className="text-blue-600 hover:underline">리스트로 돌아가기</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-blue-600 text-white py-12">
                <div className="mx-auto max-w-4xl px-8">
                    <Link href="/companies" className="text-blue-100 hover:text-white mb-6 inline-block transition-colors">
                        ← 리스트로 돌아가기
                    </Link>
                    <h1 className="text-4xl font-extrabold">{company.company_name}</h1>
                    <p className="mt-2 text-blue-100 text-lg">전문 태양광 시공 파트너</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-8 -mt-8">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* ... 기존 기본 정보 및 특화 역량 카드 ... */}
                </div>

                {/* Reviews Section (Sample) */}
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                        <Quote className="text-orange-500 w-6 h-6" /> {"고객님들의 생생한 설치 후기"}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-700 font-bold mb-4">"설치 후 전기세가 월 8만원에서 1만원으로 줄었어요!"</p>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t pt-4">
                                <span>김○○ 고객님</span>
                                <span>당진시 송악읍 | 5kW</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-700 font-bold mb-4">"견적부터 설치까지 친절하게 안내해줬어요."</p>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t pt-4">
                                <span>이○○ 고객님</span>
                                <span>서산시 해미면 | 3kW</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                <Star className="w-4 h-4 text-slate-200" />
                            </div>
                            <p className="text-slate-700 font-bold mb-4">"A/S 전화했을 때 당일 방문해줘서 믿음직스러웠습니다."</p>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t pt-4">
                                <span>박○○ 고객님</span>
                                <span>아산시 탕정면 | 10kW</span>
                            </div>
                        </div>
                    </div>
                </div>

                <LeadRequestForm companyId={company.id} companyName={company.company_name} />
            </div>
        </main>
    );
}
