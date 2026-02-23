/**
 * 브라우저(Client Components) 환경 전용 Supabase 클라이언트 생성 유틸리티입니다.
 * 싱글톤으로 작동하여 클라이언트 사이드 리소스를 효율적으로 사용합니다.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * 브라우저 환경에서 사용할 Supabase 클라이언트를 생성 및 반환합니다.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
