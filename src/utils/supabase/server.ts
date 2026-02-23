/**
 * Next.js 서버 사이드(Server Components, Server Actions, Route Handlers) 전용 
 * Supabase 클라이언트 생성 유틸리티입니다.
 * 
 * @module utils/supabase/server
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버 환경에서 안전하게 사용할 수 있는 Supabase 클라이언트를 반환합니다.
 * 쿠키를 통해 사용자의 세션을 유지하며, 서버 컴포넌트 내에서 호출됩니다.
 * 
 * @returns {Promise<SupabaseClient>} - 빌드된 Supabase 서버 클라이언트 객체
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        // 서버 액션이나 라우트 핸들러에서 쿠키를 설정할 수 있습니다.
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // 미들웨어에서 처리하도록 내버려둡니다 (Next.js 가이드라인 준수)
                    }
                },
            },
        }
    )
}
