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

interface UpdateRequest {
    id: string;
    company_id: string;
    requested_changes: any;
    status: string;
    created_at: string;
    company_profiles: {
        company_name: string;
    };
}

export default function AdminClient() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'partners' | 'updates'>('partners');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchData() {
        try {
            setLoading(true);

            // Fetch Companies
            const { data: companyData, error: companyError } = await supabase
                .from('company_profiles')
                .select('id, company_name, headquarters_address, is_verified, created_at')
                .order('created_at', { ascending: false });

            if (companyError) throw companyError;
            setCompanies(companyData || []);

            // Fetch Pending Update Requests
            const { data: requestData, error: requestError } = await supabase
                .from('profile_update_requests')
                .select('*, company_profiles(company_name)')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (requestError) throw requestError;
            setUpdateRequests(requestData || []);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
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

    const handleApproveUpdate = async (request: UpdateRequest) => {
        if (!confirm(`${request.company_profiles.company_name}의 정보 수정을 승인하시겠습니까?`)) return;

        try {
            const changes = request.requested_changes;
            const companyId = request.company_id;

            // 1. 업체 프로필 업데이트
            const { error: profileError } = await supabase
                .from('company_profiles')
                .update({
                    company_name: changes.company_name,
                    business_registration_number: changes.business_registration_number,
                    headquarters_address: changes.headquarters_address,
                    service_areas: changes.service_areas,
                    latitude: changes.latitude,
                    longitude: changes.longitude,
                })
                .eq('id', companyId);

            if (profileError) throw profileError;

            // 2. 업체 역량 정보 업데이트
            const { error: capError } = await supabase
                .from('company_capabilities')
                .upsert({
                    company_id: companyId,
                    ...changes.capabilities
                });

            if (capError) throw capError;

            // 3. 요청 상태 변경
            const { error: statusError } = await supabase
                .from('profile_update_requests')
                .update({ status: 'approved' })
                .eq('id', request.id);

            if (statusError) throw statusError;

            alert('정보 수정이 승인 및 반영되었습니다.');
            fetchData(); // 데이터 새로고침
        } catch (err: any) {
            alert('승인 중 오류 발생: ' + err.message);
        }
    };

    const handleRejectUpdate = async (id: string) => {
        if (!confirm('이 수정 요청을 거절하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('profile_update_requests')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) throw error;

            alert('요청이 거절되었습니다.');
            fetchData();
        } catch (err: any) {
            alert('거절 중 오류 발생: ' + err.message);
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
                    <div className="flex gap-4 items-center">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Update Requests</span>
                            <p className="text-xl font-black text-orange-600">{updateRequests.length}</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Partners</span>
                            <p className="text-xl font-black text-blue-600">{companies.length}</p>
                        </div>
                    </div>
                </header>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('partners')}
                        className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'partners' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                    >
                        입점 파트너 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('updates')}
                        className={`px-6 py-3 rounded-2xl font-black text-sm transition-all relative ${activeTab === 'updates' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                    >
                        정보 수정 승인
                        {updateRequests.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-50">
                                {updateRequests.length}
                            </span>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium">
                        ⚠️ 에러 발생: {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    {activeTab === 'partners' ? (
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
                    ) : (
                        <div className="p-8">
                            <div className="space-y-6">
                                {updateRequests.map((req) => (
                                    <div key={req.id} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-black mb-2 inline-block">수정 요청</span>
                                                <h3 className="text-xl font-black text-slate-900">{req.company_profiles.company_name}</h3>
                                                <p className="text-xs text-slate-400 mt-1 font-bold">요청일: {new Date(req.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleRejectUpdate(req.id)}
                                                    className="px-5 py-2.5 bg-white text-slate-500 rounded-xl text-sm font-black border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                                                >
                                                    거절
                                                </button>
                                                <button
                                                    onClick={() => handleApproveUpdate(req)}
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                                                >
                                                    승인 및 반영
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-slate-100">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> 기본 정보
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">회사명</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.company_name}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">사업자번호</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.business_registration_number}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-sm border-t border-slate-50 pt-2">
                                                        <span className="text-slate-400 font-bold">본사 주소</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.headquarters_address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-l border-slate-100 pl-6">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> 시공 역량
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">누적 용량</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.capabilities.cumulative_capacity_mw} MW</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">시공능력평가</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.capabilities.construction_capacity_value.toLocaleString()} 원</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">보증 기간</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.capabilities.warranty_period_years} 년</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400 font-bold">기술자 수</span>
                                                        <span className="text-slate-800 font-black">{req.requested_changes.capabilities.technician_count} 명</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {updateRequests.length === 0 && (
                                    <div className="py-20 text-center">
                                        <p className="text-slate-400 font-bold text-lg">새로운 정보 수정 요청이 없습니다.</p>
                                        <p className="text-slate-300 text-sm mt-2">깔끔한 상태입니다! ✨</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
