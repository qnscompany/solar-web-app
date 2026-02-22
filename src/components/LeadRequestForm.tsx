'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LeadRequestFormProps {
    companyId: string;
    companyName: string;
}

export default function LeadRequestForm({ companyId, companyName }: LeadRequestFormProps) {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        address: '',
        expected_capacity: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            console.log('Submitting lead request to company:', companyId);
            const { data, error: submitError } = await supabase
                .from('lead_requests')
                .insert([
                    {
                        company_id: companyId,
                        customer_name: formData.customer_name,
                        phone: formData.phone,
                        address: formData.address,
                        expected_capacity: formData.expected_capacity,
                        status: 'pending',
                    },
                ])
                .select();

            if (submitError) {
                console.error('Lead submission error:', submitError);
                throw submitError;
            }

            console.log('Lead submitted successfully:', data);
            setIsSuccess(true);
            setFormData({
                customer_name: '',
                phone: '',
                address: '',
                expected_capacity: '',
            });
        } catch (err: any) {
            setError(err.message || '요청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="rounded-xl bg-green-50 p-8 text-center border border-green-200">
                <h3 className="text-2xl font-bold text-green-700 mb-2">견적 요청 완료!</h3>
                <p className="text-green-600 font-medium">{companyName}에서 곧 연락드릴 예정입니다.</p>
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

                <div>
                    <label htmlFor="expected_capacity" className="block text-sm font-semibold text-gray-700 mb-2">희망 설치 용량 (kW)</label>
                    <input
                        type="text"
                        id="expected_capacity"
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-500"
                        placeholder="예: 3kW, 10kW 이상 등"
                        value={formData.expected_capacity}
                        onChange={(e) => setFormData({ ...formData, expected_capacity: e.target.value })}
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl py-4 text-lg font-bold text-white transition-all shadow-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'
                        }`}
                >
                    {isSubmitting ? '요청 중...' : `${companyName}에 견적 요청하기`}
                </button>
            </form>
        </section>
    );
}
