'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import LeadRequestForm from '@/components/LeadRequestForm';
import { Star, Quote, Award, Shield, Users, Activity } from 'lucide-react';
import { formatKoreanWon } from '@/utils/formatters';

interface CompanyDetail {
    id: string;
    company_name: string;
    service_areas: string[];
    capabilities: {
        cumulative_capacity_mw: number;
        construction_capacity_value: number;
        warranty_period_years: number;
        technician_count: number;
        installation_count: number;
    };
}

interface Review {
    id: string;
    display_name: string;
    rating: number;
    content: string;
    created_at: string;
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCompanyAndReviews() {
            try {
                // Fetch Company Details
                const { data: companyData, error: companyError } = await supabase
                    .from('company_profiles')
                    .select(`
                        id,
                        company_name,
                        service_areas,
                        capabilities:company_capabilities (
                            cumulative_capacity_mw,
                            construction_capacity_value,
                            warranty_period_years,
                            technician_count,
                            installation_count
                        )
                    `)
                    .eq('id', id)
                    .maybeSingle();

                if (companyError) throw companyError;
                if (!companyData) throw new Error('업체 정보를 찾을 수 없습니다.');

                setCompany({
                    ...companyData,
                    capabilities: (Array.isArray(companyData.capabilities) ? companyData.capabilities[0] : companyData.capabilities) || {
                        cumulative_capacity_mw: 0,
                        construction_capacity_value: 0,
                        warranty_period_years: 0,
                        technician_count: 0,
                        installation_count: 0
                    }
                } as CompanyDetail);

                // Fetch Reviews
                const { data: reviewData } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('company_id', id);

                // Fetch Experience Board Posts
                const { data: postData } = await supabase
                    .from('experience_posts')
                    .select('*')
                    .eq('company_id', id);

                // Combine and store (using a simple merge for now, could be more sophisticated)
                const combined = [
                    ...(reviewData || []).map(r => ({ ...r, type: 'review' })),
                    ...(postData || []).map(p => ({ ...p, type: 'post', display_name: '익명' }))
                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                setReviews(combined);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCompanyAndReviews();
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
            <div className="bg-slate-900 text-white py-16">
                <div className="mx-auto max-w-5xl px-8">
                    <Link href="/companies" className="text-slate-400 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors font-bold">
                        ← 전체 업체 리스트
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Verified Partner</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black">{company.company_name}</h1>
                            <p className="mt-4 text-slate-400 text-lg font-medium">우리 지역 믿을 수 있는 태양광 시공 전문가</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="text-center px-4 border-r border-white/10">
                                    <p className="text-blue-400 text-xs font-black mb-1">평균 평점</p>
                                    <p className="text-2xl font-black">
                                        {reviews.length > 0
                                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                            : '0.0'}
                                    </p>
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-blue-400 text-xs font-black mb-1">누적 시공</p>
                                    <p className="text-2xl font-black">{company.capabilities.installation_count}건</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-8 -mt-10">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* 시공실적 카드 */}
                    <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">시공실적 및 역량</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> 누적 설치 용량
                                </span>
                                <span className="text-xl font-black text-slate-900">{company.capabilities.cumulative_capacity_mw} <small className="text-xs">MW</small></span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <Award className="w-4 h-4" /> 시공능력평가액
                                </span>
                                <span className="text-xl font-black text-blue-600">{formatKoreanWon(company.capabilities.construction_capacity_value)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 보증 및 인력 카드 */}
                    <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">보증 및 전문 인력</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> 하자 보증 기간
                                </span>
                                <span className="text-xl font-black text-slate-900">{company.capabilities.warranty_period_years}년</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> 보유 기술자 수
                                </span>
                                <span className="text-xl font-black text-slate-900">{company.capabilities.technician_count}명</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <Quote className="text-blue-600 w-8 h-8" /> <span>고객님들의 실제 설치 후기</span>
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {reviews.length > 0 ? (
                            reviews.map((item, idx) => (
                                <div key={item.id || idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        {item.type === 'post' && (
                                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase">Detailed Story</span>
                                        )}
                                    </div>
                                    <p className="text-slate-700 font-bold mb-6 italic leading-relaxed">
                                        {item.type === 'post' ? (item.title + ": " + item.content) : item.content}
                                    </p>
                                    <div className="flex items-center justify-between text-xs font-black text-slate-400 border-t border-slate-50 pt-6">
                                        <span>{item.display_name} 고객님</span>
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-3 text-center py-12 text-slate-400 font-medium">아직 등록된 후기가 없습니다.</p>
                        )}
                    </div>
                </div>

                <LeadRequestForm companyId={company.id} companyName={company.company_name} />
            </div>
        </main>
    );
}
