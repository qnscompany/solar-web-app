'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import LeadRequestForm from '@/components/LeadRequestForm';

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
                    <div className="rounded-2xl bg-white p-8 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 border-b pb-2">기본 정보</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">설치 가능 지역</span>
                                <span className="font-semibold text-gray-800">{company.service_areas?.join(', ') || '전국'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">누적 설치 용량</span>
                                <span className="font-semibold text-gray-800">{company.capabilities?.cumulative_capacity_mw || 0} MW</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">시공능력평가액</span>
                                <span className="font-semibold text-gray-800">{(company.capabilities?.construction_capacity_value || 0).toLocaleString()} 원</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 border-b pb-2">특화 역량</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">무상 보증 기간</span>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                                    {company.capabilities?.warranty_period_years || 0}년
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">보유 기술자 수</span>
                                <span className="font-semibold text-gray-800">{company.capabilities?.technician_count || 0}명</span>
                            </div>

                        </div>
                    </div>
                </div>

                <LeadRequestForm companyId={company.id} companyName={company.company_name} />
            </div>
        </main>
    );
}
