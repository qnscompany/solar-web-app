/**
 * SUPABASE_SERVICE_ROLE_KEY를 사용하는 관리자 전용 클라이언트입니다.
 * RLS(Row Level Security)를 우회하므로 서버 사이드에서만 극히 제한적으로 사용해야 합니다.
 * 주의: 클라이언트 사이드(브라우저)에서 절대 노출되지 않도록 하십시오.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * 모든 권한(Superuser)을 가진 Supabase 관리자용 클라이언트를 생성합니다.
 * 주요 사용처: 백그라운드 작업, 알림 이메일 발송 등 RLS 제한을 넘어야 하는 경우
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 환경변수 누락 시 런타임 에러 발생 (보안 및 디버깅 용이성)
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('CRITICAL: Missing Supabase Admin environment variables');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false, // 관리자 클라이언트는 세션 갱신 불필요
            persistSession: false    // 서버 사이드 일회성 작업이므로 세션 저장 안 함
        }
    });
}
