'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCoordinatesAction } from '@/app/actions/geocoding';

function OnboardingForm() {
    const searchParams = useSearchParams();
    const isEdit = searchParams.get('edit') === 'true';
    const [activeTab, setActiveTab] = useState<'create' | 'claim'>('create');
    const [formData, setFormData] = useState({
        company_name: '',
        business_registration_number: '',
        headquarters_address: '',
        service_areas: '',
        cumulative_capacity_mw: '',
        construction_capacity_value: '',
        warranty_period_years: '2',
        technician_count: '1',
    });
    const [claimCode, setClaimCode] = useState('');
    const [claimCompanyName, setClaimCompanyName] = useState('');

    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function checkProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    console.log('Checking profile for user:', user.id);
                    const { data, error: profileError } = await supabase
                        .from('company_profiles')
                        .select(`
                            *,
                            capabilities:company_capabilities (*)
                        `)
                        .eq('owner_id', user.id)
                        .maybeSingle();

                    if (data && !isEdit) {
                        console.log('Profile already exists, redirecting to dashboard...');
                        router.replace('/dashboard');
                    } else if (data && isEdit) {
                        console.log('Editing existing profile:', data.id);
                        setProfileId(data.id);
                        const caps = Array.isArray(data.capabilities) ? data.capabilities[0] : data.capabilities;
                        setFormData({
                            company_name: data.company_name || '',
                            business_registration_number: data.business_registration_number || '',
                            headquarters_address: data.headquarters_address || '',
                            service_areas: data.service_areas?.join(', ') || '',
                            cumulative_capacity_mw: caps?.cumulative_capacity_mw?.toString() || '',
                            construction_capacity_value: caps?.construction_capacity_value?.toString() || '',
                            warranty_period_years: caps?.warranty_period_years?.toString() || '2',
                            technician_count: caps?.technician_count?.toString() || '1',
                        });
                        setInitializing(false);
                    } else {
                        console.log('Ready for registration. Profile check result:', data, profileError);
                        setInitializing(false);
                    }
                } else {
                    router.replace('/login');
                }
            } catch (err) {
                console.error('Error in checkProfile:', err);
                setInitializing(false);
            }
        }
        checkProfile();
    }, [supabase, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('인증 세션이 만료되었습니다. 다시 로그인해 주세요.');

            // 주소를 위경도로 변환
            let latitude = null;
            let longitude = null;
            try {
                const coords = await getCoordinatesAction(formData.headquarters_address);
                if (coords) {
                    latitude = coords.lat;
                    longitude = coords.lng;
                }
            } catch (geoErr) {
                console.error('Geocoding failed during form submission:', geoErr);
            }

            if (activeTab === 'create') {
                if (isEdit && profileId) {
                    // Instead of updating directly, create an approval request
                    const requestedChanges = {
                        company_name: formData.company_name,
                        business_registration_number: formData.business_registration_number,
                        headquarters_address: formData.headquarters_address,
                        service_areas: formData.service_areas.split(',').map(s => s.trim()),
                        latitude,
                        longitude,
                        capabilities: {
                            cumulative_capacity_mw: parseFloat(formData.cumulative_capacity_mw) || 0,
                            construction_capacity_value: parseInt(formData.construction_capacity_value) || 0,
                            warranty_period_years: parseInt(formData.warranty_period_years) || 2,
                            technician_count: parseInt(formData.technician_count) || 1,
                        }
                    };

                    const { error: requestError } = await supabase
                        .from('profile_update_requests')
                        .insert([{
                            company_id: profileId,
                            requested_changes: requestedChanges,
                            status: 'pending'
                        }]);

                    if (requestError) throw requestError;

                    alert('정보 수정 요청이 완료되었습니다. 관리자 승인 후 반영됩니다.');
                    router.push('/dashboard');
                    return;
                } else {
                    // 1. 업체 프로필 생성
                    const { data: profile, error: profileError } = await supabase
                        .from('company_profiles')
                        .insert([
                            {
                                company_name: formData.company_name,
                                business_registration_number: formData.business_registration_number,
                                headquarters_address: formData.headquarters_address,
                                service_areas: formData.service_areas.split(',').map(s => s.trim()),
                                owner_id: user.id,
                                latitude,
                                longitude,
                            }
                        ])
                        .select()
                        .maybeSingle();

                    if (profileError) throw profileError;
                    if (!profile) throw new Error('프로필 생성에 실패했습니다.');

                    // 2. 업체 역량 정보 생성
                    const { error: capError } = await supabase
                        .from('company_capabilities')
                        .insert([
                            {
                                company_id: profile.id,
                                cumulative_capacity_mw: parseFloat(formData.cumulative_capacity_mw) || 0,
                                construction_capacity_value: parseInt(formData.construction_capacity_value) || 0,
                                warranty_period_years: parseInt(formData.warranty_period_years) || 2,
                                technician_count: parseInt(formData.technician_count) || 1,
                            }
                        ]);

                    if (capError) throw capError;
                }
            } else {
                // 기존 프로필 가져오기 (Claim)
                // RLS 정책상 owner_id가 NULL인 경우에만 가져올 수 있도록 설정되어야 함
                const { data: updated, error: claimError } = await supabase
                    .from('company_profiles')
                    .update({ owner_id: user.id })
                    .eq('company_name', claimCompanyName)
                    .eq('claim_code', claimCode) // DB에 claim_code 컬럼이 있다고 가정
                    .is('owner_id', null)
                    .select();

                if (claimError) throw claimError;
                if (!updated || updated.length === 0) {
                    throw new Error('회사명 또는 Claim Code가 일치하지 않거나 이미 연결된 업체입니다.');
                }
            }

            router.push('/dashboard');
        } catch (err: any) {
            let message = err.message || '처리 중 오류가 발생했습니다.';
            if (message.includes('business_registration_number') && message.includes('unique')) {
                message = '이미 등록된 사업자등록번호입니다. "기존 정보 가져오기" 탭에서 정보를 연결하거나, 번호를 확인해 주세요.';
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (initializing) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 font-bold">인증 상태 확인 중...</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-6">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {isEdit ? '업체 정보 수정' : '파트너 등록하기'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? '등록된 업체 정보를 최신 상태로 업데이트하세요.' : '업체 정보를 등록하거나 기존 정보를 가져오세요.'}
                    </p>
                </div>

                {/* Tabs */}
                {!isEdit && (
                    <div className="flex gap-4 mb-10 bg-gray-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            신규 프로필 생성
                        </button>
                        <button
                            onClick={() => setActiveTab('claim')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'claim' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            기존 업체 정보 연결
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {activeTab === 'create' ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">회사명</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 한화솔루션"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">사업자등록번호</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="000-00-00000"
                                    value={formData.business_registration_number}
                                    onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">본사 주소</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 서울특별시 강남구 ..."
                                    value={formData.headquarters_address}
                                    onChange={(e) => setFormData({ ...formData, headquarters_address: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">설치 가능 권역 (쉼표로 구분)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 서울, 경기, 인천"
                                    value={formData.service_areas}
                                    onChange={(e) => setFormData({ ...formData, service_areas: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">누적 설치 용량 (MW)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 15.5"
                                    value={formData.cumulative_capacity_mw}
                                    onChange={(e) => setFormData({ ...formData, cumulative_capacity_mw: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">시공능력평가액 (원)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 500000000"
                                    value={formData.construction_capacity_value}
                                    onChange={(e) => setFormData({ ...formData, construction_capacity_value: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">무상 보증 기간 (년)</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                                    value={formData.warranty_period_years}
                                    onChange={(e) => setFormData({ ...formData, warranty_period_years: e.target.value })}
                                >
                                    {[1, 2, 3, 5, 10].map(y => <option key={y} value={y}>{y}년</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">보유 기술자 수 (명)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                                    value={formData.technician_count}
                                    onChange={(e) => setFormData({ ...formData, technician_count: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                <span className="text-2xl mt-0.5">💡</span>
                                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                                    이미 시스템에 등록된 업체의 정보를 가져오려면 회사명과 관리자로부터 부여받은 <strong>Claim Code</strong>를 입력해 주세요.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">등록된 회사명</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="예: 현대에너지솔루션"
                                    value={claimCompanyName}
                                    onChange={(e) => setClaimCompanyName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Claim Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="관리자 발급 8자리 코드"
                                    value={claimCode}
                                    onChange={(e) => setClaimCode(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
                    >
                        {loading ? '처리 중...' : isEdit ? '수정 완료 및 저장' : activeTab === 'create' ? '파트너 등록 완료' : '정보 연결 및 완료'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default function OnboardingCompanyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-bold">로딩 중...</div>
            </div>
        }>
            <OnboardingForm />
        </Suspense>
    );
}
