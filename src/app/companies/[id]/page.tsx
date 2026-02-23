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

/**
 * 특정 업체 상세 정보 페이지 (Dynamic Route)
 * 서버로부터 업체 프로필과 역량 정보를 가져와 상세히 보여줍니다.
 */
export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // [Next.js dynamic params] React 'use' 훅을 통해 비동기 파라미터를 해제합니다.
    const { id } = use(params);

    // [상태 관리] 업체 데이터, 로딩 상태, 에러 상태
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * 업체 상세 데이터 및 관계 테이블(capabilities) 데이터를 페칭합니다.
         */
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

                // [데이터 정규화] Supabase 관계 쿼리 결과가 배열일 경우 첫 번째 항목을 사용합니다.
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

    // -----------------------------------------------------------------
    // [조건부 렌더링] 로딩 중 및 에러 시 화면 처리
    // -----------------------------------------------------------------
    if (loading) return <div className="p-8 text-center text-xl font-medium">상세 정보를 불러오는 중...</div>;

    if (error || !company) return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">데이터를 불러오지 못했습니다: {error || '업체를 찾을 수 없습니다.'}</p>
            <Link href="/companies" className="text-blue-600 hover:underline">리스트로 돌아가기</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* 업체 타이틀 영역 */}
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
                {/* [상세 레이아웃 영역] 실무 개발자가 확장 가능하도록 그리드로 구성 */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* (기존 상세 정보 카드들이 여기에 배치됩니다) */}
                </div>

                {/* [SECTION] 고객 설치 후기 (샘플 데이터)
                    - 사회적 증명(Social Proof)을 통해 신뢰도를 높이는 UI 섹션
                */}
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                        <Quote className="text-orange-500 w-6 h-6" /> {"고객님들의 생생한 설치 후기"}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* 후기 카드 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-700 font-bold mb-4">"설치 후 전기세가 월 8만원에서 1만원으로 줄었어요!"</p>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t pt-4">
                                <span>김○○ 고객님</span>
                                <span>당진시 송악읍 | 5kW</span>
                            </div>
                        </div>
                        {/* 후기 카드 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                            <div className="flex text-yellow-400 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-700 font-bold mb-4">"견적부터 설치까지 친절하게 안내해줬어요."</p>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t pt-4">
                                <span>이○○ 고객님</span>
                                <span>서산시 해미면 | 3kW</span>
                            </div>
                        </div>
                        {/* 후기 카드 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
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

                {/* [FORM] 견적 요청 입력 인터페이스 */}
                <LeadRequestForm companyId={company.id} companyName={company.company_name} />
            </div>
        </main>
    );
}
