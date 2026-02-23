/**
 * 리드(견적 요청) 관련 서버 액션 모음
 * 전문 개발자를 위해 상세 주석과 표준화된 에러 핸들링을 제공합니다.
 */

'use server';

import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * 알림 발송 파라미터 인터페이스
 */
interface SendLeadNotificationParams {
    leadId: string;    // 리드 요청 고유 ID
    companyId: string; // 알림을 받을 업체 ID
}

/**
 * 리드 생성 시 해당 업체 담당자에게 이메일 알림을 발송하는 서버 액션
 * 
 * @param params {SendLeadNotificationParams} - 리드 및 업체 ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} - 성공 여부 및 결과 데이터
 */
export async function sendLeadNotificationAction({ leadId, companyId }: SendLeadNotificationParams) {
    // [환경변수 검증] Resend API 키 존재 여부 확인
    if (!process.env.RESEND_API_KEY) {
        console.error('[Email Notification] Critical: RESEND_API_KEY is missing in server environment');
        return { success: false, error: '서버 설정 오류: 이메일 발송 기능을 사용할 수 없습니다.' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = createAdminClient(); // RLS 우회를 위해 관리자 클라이언트 사용

    try {
        console.log(`[Email Notification] Operation Start - Lead: ${leadId}, Company: ${companyId}`);

        // [STEP 1] 데이터 페칭: 리드 정보 및 해당 업체의 알림용 이메일 조회
        // 관계 쿼리를 통해 업체의 상세 정보를 함께 가져옵니다.
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

        // 쿼리 에러 처리
        if (leadError) {
            console.error('[Email Notification] Supabase query error:', leadError);
            return { success: false, error: `데이터베이스 조회 실패: ${leadError.message}` };
        }

        // 데이터 존재 여부 확인
        if (!lead) {
            console.error(`[Email Notification] Lead not found for ID: ${leadId}`);
            return { success: false, error: '견적 요청 정보를 찾을 수 없습니다.' };
        }

        const company = lead.company as any;
        const targetEmail = company?.notification_email;

        // 업체 수신 이메일 누락 시 처리
        if (!targetEmail) {
            console.warn(`[Email Notification] No notification email set for company: ${company?.company_name}`);
            return { success: false, error: '해당 업체에 등록된 알림 이메일이 없습니다.' };
        }

        // [STEP 2] 이메일 발송: Resend API 사용
        // HTML 템플릿은 모바일 대응 및 직관적인 정보 전달을 목표로 디자인되었습니다.
        console.log('[Email Notification] Executing Resend API call...');
        const { data, error: sendError } = await resend.emails.send({
            from: '쨍하고 알림 <onboarding@resend.dev>', // TODO: 실제 서비스 도메인 연동 시 변경 필요
            to: targetEmail,
            subject: `[쨍하고] ${company.company_name}님, 새로운 견적 요청이 도착했습니다!`,
            html: `
                <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 24px; font-weight: 900; color: #f97316;">쨍하고</span>
                    </div>
                    
                    <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; border-bottom: 4px solid #fecaca; display: inline-block; padding-bottom: 2px;">새로운 견적 요청 알림</h2>
                    
                    <p style="font-size: 16px; color: #334155; margin-top: 25px; line-height: 1.6;">
                        <strong>${company.company_name}</strong> 파트너님,<br/> 
                        태양광 설치를 희망하는 잠재 고객의 새로운 견적이 접수되었습니다.
                    </p>
                    
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.05em;">고객 상세 정보</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; color: #1e293b; font-size: 15px;">
                            <li style="margin-bottom: 12px;"><strong>👤 성함:</strong> ${lead.customer_name}</li>
                            <li style="margin-bottom: 12px;"><strong>📞 연락처:</strong> ${lead.phone}</li>
                            <li style="margin-bottom: 12px;"><strong>📍 설치 주소:</strong> ${lead.address}</li>
                            <li style="margin-bottom: 12px;"><strong>⚡ 희망 용량:</strong> ${lead.expected_capacity}</li>
                            ${lead.notes ? `
                            <li style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                                <strong>📝 기타 요청사항</strong><br/>
                                <div style="color: #475569; margin-top: 8px; font-size: 14px; background: #ffffff; padding: 12px; border-radius: 8px;">
                                    ${lead.notes.replace(/\n/g, '<br/>')}
                                </div>
                            </li>` : ''}
                        </ul>
                    </div>
                    
                    <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
                        * 고객님께서 빠른 상담을 기다리고 계십니다. 대시보드에서 상담 진행 상황을 변경해 주세요.
                    </p>
                    
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
                           style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; transition: background-color 0.2s;">
                           파트너 대시보드로 이동
                        </a>
                    </div>
                    
                    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                        <p style="font-size: 12px; color: #cbd5e1; margin: 0;">본 메일은 쨍하고 파트너님을 위해 자동으로 발송된 알림입니다.</p>
                    </div>
                </div>
            `,
        });

        // 발송 API 에러 처리
        if (sendError) {
            console.error('[Email Notification] Resend API error:', sendError);
            return { success: false, error: `이메일 발송 API 오류: ${sendError.message}` };
        }

        console.log('[Email Notification] Operation Finished Successfully. Email ID:', data?.id);
        return { success: true, data };

    } catch (err: any) {
        // 예상치 못한 시스템 오류 캐치
        console.error('CRITICAL: Unexpected error in sendLeadNotificationAction:', err);
        return { success: false, error: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }
}
