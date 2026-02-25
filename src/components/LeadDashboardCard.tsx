'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

interface Lead {
    id: string;
    customer_name: string;
    phone: string;
    address: string;
    expected_capacity: string;
    status: string;
    created_at: string;
}

interface LeadDashboardCardProps {
    lead: Lead;
    onStatusUpdate: () => void;
}

export default function LeadDashboardCard({ lead, onStatusUpdate }: LeadDashboardCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const supabase = createClient();

    const updateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('lead_requests')
                .update({ status: newStatus })
                .eq('id', lead.id);

            if (error) throw error;
            onStatusUpdate();
        } catch (err: any) {
            alert('상태 업데이트 실패: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{lead.customer_name}</h3>
                <span className="text-xs text-gray-400">{formatDate(lead.created_at)}</span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                    <span className="w-16 font-medium text-gray-400">연락처</span>
                    <span className="text-gray-800">{lead.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-16 font-medium text-gray-400 shrink-0">주소</span>
                    <span className="text-gray-800 line-clamp-2">{lead.address}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-16 font-medium text-gray-400">용량</span>
                    <span className="text-blue-600 font-semibold">{lead.expected_capacity}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                {/* 리드 상태 되돌리기 (Left Arrow) */}
                {lead.status === 'consulting' && (
                    <button
                        onClick={() => updateStatus('pending')}
                        disabled={isUpdating}
                        className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                        title="신규 리드로 되돌리기"
                    >
                        <span>←</span> <span className="hidden sm:inline">이전</span>
                    </button>
                )}
                {lead.status === 'completed' && (
                    <button
                        onClick={() => updateStatus('consulting')}
                        disabled={isUpdating}
                        className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                        title="상담 중으로 되돌리기"
                    >
                        <span>←</span> <span className="hidden sm:inline">이전</span>
                    </button>
                )}
                {lead.status === 'installed' && (
                    <button
                        onClick={() => updateStatus('completed')}
                        disabled={isUpdating}
                        className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                        title="계약 완료로 되돌리기"
                    >
                        <span>←</span> <span className="hidden sm:inline">이전</span>
                    </button>
                )}

                {/* 리드 상태 전진 (Right Arrow / Main Action) */}
                {(lead.status === 'pending' || lead.status === 'new') && (
                    <button
                        onClick={() => updateStatus('consulting')}
                        disabled={isUpdating}
                        className="flex-[3] bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        {isUpdating ? '처리 중...' : '상담 시작 →'}
                    </button>
                )}
                {lead.status === 'consulting' && (
                    <button
                        onClick={() => updateStatus('completed')}
                        disabled={isUpdating}
                        className="flex-[2] bg-yellow-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors shadow-sm"
                    >
                        {isUpdating ? '처리 중...' : '계약 완료 →'}
                    </button>
                )}
                {lead.status === 'completed' && (
                    <button
                        onClick={() => updateStatus('installed')}
                        disabled={isUpdating}
                        className="flex-[2] bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
                    >
                        {isUpdating ? '처리 중...' : '시공 완료 →'}
                    </button>
                )}

                {/* 완료/취소 상태 표시 및 취소 버튼 */}
                {(lead.status === 'pending' || lead.status === 'new' || lead.status === 'consulting') && (
                    <button
                        onClick={() => updateStatus('canceled')}
                        disabled={isUpdating}
                        className="px-3 bg-red-50 text-red-400 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                        title="요청 취소"
                    >
                        ✕
                    </button>
                )}

                {lead.status === 'installed' && (
                    <div className="flex-[3] text-center text-green-600 font-bold text-sm py-2 bg-green-50 rounded-lg">
                        ✓ 시공 완료됨
                    </div>
                )}
                {lead.status === 'canceled' && (
                    <div className="w-full flex justify-between items-center px-2">
                        <span className="text-gray-400 font-bold text-sm py-2 italic">취소됨</span>
                        <button
                            onClick={() => updateStatus('pending')}
                            disabled={isUpdating}
                            className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded hover:bg-gray-200"
                        >
                            복구하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
