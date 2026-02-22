'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import LeadDashboardCard from '@/components/LeadDashboardCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Lead {
    id: string;
    customer_name: string;
    phone: string;
    address: string;
    expected_capacity: string;
    status: string;
    created_at: string;
}

export default function DashboardPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const fetchLeads = async () => {
        try {
            // 1. 현재 사용자 정보 가져오기
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('인증 정보가 없습니다.');

            setUserId(user.id);

            // 2. 사용자와 연결된 업체 ID 가져오기
            const { data: profile, error: profileError } = await supabase
                .from('company_profiles')
                .select('id, company_name')
                .eq('owner_id', user.id)
                .maybeSingle();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                throw profileError;
            }

            if (!profile) {
                console.log('No profile found, redirecting to registration...');
                router.replace('/onboarding/company');
                return;
            }

            console.log('Profile loaded:', profile.company_name);

            setCompanyName(profile.company_name);

            // 3. 해당 업체의 리드만 가져오기
            // RLS가 설정되어 있으므로 본인 데이터만 자동으로 필터링되지만, 
            // 명시적으로 본인 company_id를 eq로 거는 것이 안전합니다.
            const { data: leadData, error: fetchError } = await supabase
                .from('lead_requests')
                .select('*')
                .eq('company_id', profile.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setLeads(leadData || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filterLeads = (status: string) => {
        if (status === 'pending') {
            return leads.filter(lead => lead.status === 'pending' || lead.status === 'new');
        }
        return leads.filter(lead => lead.status === status);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-bold text-gray-400">대시보드 로딩 중...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{companyName || '파트너'} 대시보드</h1>
                        <p className="text-gray-500 text-sm">유입된 견적 요청을 관리하세요</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/onboarding/company?edit=true" className="text-blue-600 font-bold hover:text-blue-700 text-sm transition-colors">
                            업체 정보 수정
                        </Link>
                        <Link href="/companies" className="text-gray-500 font-medium hover:text-blue-600 text-sm transition-colors">
                            업체 리스트 페이지
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="max-w-[1400px] mx-auto px-8 py-10">
                {error && (
                    <div className="mb-8 p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⚠️</span>
                            <span className="font-bold">{error}</span>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-red-600 font-bold hover:underline text-sm"
                        >
                            새로고침
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column: New */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                신규 리드
                            </h2>
                            <span className="bg-gray-200 text-gray-600 text-xs font-black px-2 py-1 rounded-md">
                                {filterLeads('pending').length}
                            </span>
                        </div>
                        <div className="bg-gray-200/50 rounded-2xl p-4 flex-1 space-y-4 min-h-[500px]">
                            {filterLeads('pending').map(lead => (
                                <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />
                            ))}
                            {filterLeads('pending').length === 0 && (
                                <div className="text-center py-20 text-gray-400 text-sm">신규 리드가 없습니다.</div>
                            )}
                        </div>
                    </div>

                    {/* Column: Consulting */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                상담 중
                            </h2>
                            <span className="bg-gray-200 text-gray-600 text-xs font-black px-2 py-1 rounded-md">
                                {filterLeads('consulting').length}
                            </span>
                        </div>
                        <div className="bg-gray-200/50 rounded-2xl p-4 flex-1 space-y-4">
                            {filterLeads('consulting').map(lead => (
                                <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />
                            ))}
                            {filterLeads('consulting').length === 0 && (
                                <div className="text-center py-20 text-gray-400 text-sm">상담 중인 건이 없습니다.</div>
                            )}
                        </div>
                    </div>

                    {/* Column: Completed */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="font-bold text-gray-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                계약 완료
                            </h2>
                            <span className="bg-gray-200 text-gray-600 text-xs font-black px-2 py-1 rounded-md">
                                {filterLeads('completed').length}
                            </span>
                        </div>
                        <div className="bg-gray-200/50 rounded-2xl p-4 flex-1 space-y-4">
                            {filterLeads('completed').map(lead => (
                                <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />
                            ))}
                            {filterLeads('completed').length === 0 && (
                                <div className="text-center py-20 text-gray-400 text-sm">완료된 건이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
