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
        <main className="min-h-screen bg-gray-50">
            {/* Simple Header */}
            <header className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">{companyName || '파트너'} 대시보드</h1>
                        <p className="text-slate-500 text-sm font-bold">유입된 견적 요청을 한눈에 관리하세요</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/onboarding/company?edit=true" className="text-blue-600 font-bold hover:underline text-sm">업체 정보 수정</Link>
                        <Link href="/companies" className="text-slate-500 font-bold hover:text-slate-800 text-sm">업체 리스트</Link>
                        <button onClick={handleLogout} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200">로그아웃</button>
                    </div>
                </div>
            </header>

            {/* Robust 4-Column Grid */}
            <div className="max-w-[1600px] mx-auto px-6 py-10">
                {error && (
                    <div className="mb-8 p-6 bg-red-50 text-red-700 rounded-3xl border border-red-100 font-bold text-center">{error}</div>
                )}

                {/* Scrollable Container for Robustness */}
                <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[1200px] lg:min-w-0">
                        {/* Column 1 */}
                        <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-8 px-1">
                                <h2 className="font-black text-slate-800 flex items-center gap-2.5 text-lg"><span className="w-3 h-3 rounded-full bg-blue-500"></span>신규 리드</h2>
                                <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">{filterLeads('pending').length}</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                {filterLeads('pending').map(lead => <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />)}
                                {filterLeads('pending').length === 0 && <div className="text-center py-20 text-slate-300 font-bold text-sm">비어 있음</div>}
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8 px-1">
                                <h2 className="font-black text-slate-800 flex items-center gap-2.5 text-lg"><span className="w-3 h-3 rounded-full bg-orange-500"></span>상담 중</h2>
                                <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">{filterLeads('consulting').length}</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                {filterLeads('consulting').map(lead => <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />)}
                                {filterLeads('consulting').length === 0 && <div className="text-center py-20 text-slate-300 font-bold text-sm">비어 있음</div>}
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8 px-1">
                                <h2 className="font-black text-slate-800 flex items-center gap-2.5 text-lg"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>계약 완료</h2>
                                <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1 rounded-full">{filterLeads('completed').length}</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                {filterLeads('completed').map(lead => <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />)}
                                {filterLeads('completed').length === 0 && <div className="text-center py-20 text-slate-300 font-bold text-sm">비어 있음</div>}
                            </div>
                        </div>

                        {/* Column 4 - 시공 완료 (Most Visible) */}
                        <div className="bg-slate-900 rounded-[40px] p-6 border border-slate-800 shadow-2xl flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="flex items-center justify-between mb-8 px-1 relative z-10">
                                <h2 className="font-black text-white flex items-center gap-2.5 text-lg"><span className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]"></span>시공 완료</h2>
                                <span className="bg-slate-800 text-blue-400 text-xs font-black px-3 py-1 rounded-full">{filterLeads('installed').length}</span>
                            </div>
                            <div className="space-y-4 flex-1 relative z-10">
                                {filterLeads('installed').map(lead => <LeadDashboardCard key={lead.id} lead={lead} onStatusUpdate={fetchLeads} />)}
                                {filterLeads('installed').length === 0 && <div className="text-center py-20 text-slate-600 font-bold text-sm">비어 있음</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
