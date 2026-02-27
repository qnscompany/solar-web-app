import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { sendLeadNotificationAction, createLeadAction } from '@/app/actions/leads';

interface LeadRequestFormProps {
    companyId?: string;
    companyName?: string;
}

/**
 * 고객 견적 요청 폼 컴포넌트
 * 업체 상세 페이지 또는 메인 랜딩 페이지에서 사용자가 견적을 요청할 때 사용됩니다.
 */
export default function LeadRequestForm({ companyId, companyName }: LeadRequestFormProps) {
    // [상태 관리] 사용자 입력 데이터 및 UI 상태(제출 중, 성공 여부, 에러)
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        address: '',
        expected_capacity_kw: '3', // 기본값 3kW
        property_type: 'roof', // 'roof', 'land'
        notes: '',
    });
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const displayName = companyName || '우리 동네 우수 업체';

    /**
     * 폼 제출 이벤트 핸들러
     * 1. 개인정보 동의 여부 체크
     * 2. DB에 견적 요청 저장
     * 3. 해당 업체에 알림 이메일 발송 (Server Action 호출)
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // [STEP 0] 개인정보 동의 체크
        if (!isAgreed) {
            setError('개인정보 수집·이용에 동의해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // [STEP 1] 공개/비공개 리드 생성 서버 액션 호출
            const result = await createLeadAction({
                customer_name: formData.customer_name,
                phone: formData.phone,
                address_full: formData.address,
                expected_capacity_kw: Number(formData.expected_capacity_kw),
                property_type: formData.property_type,
                notes: formData.notes // Notes는 일단 Public에 저장하거나 추후 확장
            } as any);

            if (!result.success) {
                throw new Error(result.error);
            }

            const newLeadId = result.leadId;

            // [STEP 2] 업체 담당자에게 이메일 알림 발송 (업체 ID가 있는 경우만)
            if (companyId && newLeadId) {
                await sendLeadNotificationAction({
                    leadId: newLeadId,
                    companyId: companyId
                });
            }

            // [STEP 3] UI 성공 상태로 전환 및 데이터 초기화
            setIsSuccess(true);
            setFormData({
                customer_name: '',
                phone: '',
                address: '',
                expected_capacity_kw: '3',
                property_type: 'roof',
                notes: '',
            });
            setIsAgreed(false);
        } catch (err: any) {
            setError(err.message || '요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="rounded-xl bg-green-50 p-8 text-center border border-green-200">
                <h3 className="text-2xl font-bold text-green-700 mb-2">견적 요청 완료!</h3>
                <p className="text-green-600 font-medium">검증된 업체에서 곧 연락드릴 예정입니다.</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    추가 요청하기
                </button>
            </div>
        );
    }

    return (
        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 border-b pb-4">무료 견적 요청하기</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                        <input
                            type="text"
                            id="customer_name"
                            required
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500"
                            placeholder="홍길동"
                            value={formData.customer_name}
                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
                        <input
                            type="tel"
                            id="phone"
                            required
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500"
                            placeholder="010-0000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">설치 주소</label>
                    <input
                        type="text"
                        id="address"
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500"
                        placeholder="서울시 강남구..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="property_type" className="block text-sm font-semibold text-gray-700 mb-2">설치 형태</label>
                        <select
                            id="property_type"
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                            value={formData.property_type}
                            onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                        >
                            <option value="roof">지붕 (주택/창고)</option>
                            <option value="land">토지</option>
                            <option value="factory">공장</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="expected_capacity_kw" className="block text-sm font-semibold text-gray-700 mb-2">희망 설치 용량 (kW)</label>
                        <input
                            type="number"
                            id="expected_capacity_kw"
                            required
                            min="1"
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500"
                            placeholder="예: 3"
                            value={formData.expected_capacity_kw}
                            onChange={(e) => setFormData({ ...formData, expected_capacity_kw: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">기타 요청사항 (선택)</label>
                    <textarea
                        id="notes"
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500 resize-none"
                        placeholder="설치 장소의 특이사항이나 궁금하신 점을 자유롭게 적어주세요."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center h-5">
                        <input
                            id="privacy-consent"
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => {
                                setIsAgreed(e.target.checked);
                                if (e.target.checked) setError(null);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="privacy-consent" className="text-sm font-bold text-slate-500 leading-tight cursor-pointer">
                        <Link href="/privacy" className="text-blue-600 underline underline-offset-2 hover:text-blue-700">{"[개인정보처리방침]"}</Link>
                        {"에 동의합니다. (필수)"}
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-2xl py-5 text-xl font-black text-white transition-all shadow-xl ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' :
                        !isAgreed ? 'bg-slate-300 cursor-pointer hover:bg-slate-400' :
                            'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:transform active:scale-[0.98]'
                        }`}
                >
                    {isSubmitting ? '요청 전송 중...' : `${displayName} 무료 견적 받기`}
                </button>
            </form>
        </section>
    );
}
