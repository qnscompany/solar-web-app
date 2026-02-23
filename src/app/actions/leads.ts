'use server';

import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendLeadNotificationParams {
    leadId: string;
    companyId: string;
}

export async function sendLeadNotificationAction({ leadId, companyId }: SendLeadNotificationParams) {
    const supabase = createAdminClient();

    try {
        console.log(`[Email Notification] Starting for Lead ID: ${leadId}, Company ID: ${companyId}`);

        // 1. 리드 상세 정보 및 업체 알림 이메일 조회 (상세 로그 추가)
        const { data: lead, error: leadError } = await supabase
            .from('lead_requests')
            .select(`
                *,
                company:company_profiles (
                    id,
                    company_name,
                    notification_email
                )
            `)
            .eq('id', leadId)
            .maybeSingle();

        if (leadError) {
            console.error('[Email Notification] Supabase query error:', leadError);
            return { success: false, error: `DB 조회 오류: ${leadError.message}` };
        }

        if (!lead) {
            console.error(`[Email Notification] Lead not found for ID: ${leadId}`);
            return { success: false, error: '해당 리드 정보를 찾을 수 없습니다.' };
        }

        console.log('[Email Notification] Lead Data Fetched:', JSON.stringify(lead, null, 2));

        const company = lead.company as any;
        const targetEmail = company?.notification_email;

        console.log(`[Email Notification] Target Email: ${targetEmail}, Company: ${company?.company_name}`);

        if (!targetEmail) {
            console.warn(`[Email Notification] No notification email set for company: ${company?.company_name}`);
            return { success: false, error: '업체에 설정된 알림 이메일이 없습니다.' };
        }

        // 2. 이메일 발송 (Resend)
        console.log('[Email Notification] Sending via Resend...');
        const { data, error: sendError } = await resend.emails.send({
            from: 'Solar App <onboarding@resend.dev>', // 테스트를 위해 Resend 기본 도메인 사용
            to: targetEmail,
            subject: `[쨍하고] ${company.company_name}님, 새로운 견적 요청이 도착했습니다!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">🏠 새로운 견적 요청 알림</h2>
                    <p style="font-size: 16px; color: #475569; margin-top: 20px;">
                        <strong>${company.company_name}</strong> 파트너님, 새로운 잠재 고객의 견적 요청이 접수되었습니다.
                    </p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                            <li><strong>👤 고객명:</strong> ${lead.customer_name}</li>
                            <li><strong>📞 연락처:</strong> ${lead.phone}</li>
                            <li><strong>📍 주소:</strong> ${lead.address}</li>
                            <li><strong>⚡ 희망 용량:</strong> ${lead.expected_capacity}</li>
                        </ul>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">
                        * 대시보드에 접속하여 상세 정보 확인 및 상담 상태를 업데이트해 주세요.
                    </p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                           대시보드로 이동하기
                        </a>
                    </div>
                </div>
            `,
        });

        if (sendError) {
            console.error('[Email Notification] Resend API error:', sendError);
            return { success: false, error: `이메일 발송 API 오류: ${sendError.message}` };
        }

        console.log('[Email Notification] SUCCESS! Email ID:', data?.id);
        return { success: true, data };

    } catch (err: any) {
        console.error('Unexpected error in sendLeadNotificationAction:', err);
        return { success: false, error: err.message };
    }
}
