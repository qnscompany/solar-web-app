/**
 * Next.js 미들웨어 계층의 Supabase 세션 관리 로직입니다.
 * 각 요청 시 쿠키 기반의 세션을 검증하고 만료된 경우 갱신합니다.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 요청(Request) 객체를 바탕으로 Supabase 세션을 업데이트하고 필요한 경우 리다이렉트합니다.
 * 
 * @param request {NextRequest} - Next.js 요청 객체
 * @returns {Promise<NextResponse>} - 처리 결과가 담긴 응답 객체
 */
export async function updateSession(request: NextRequest) {
    // 기본 응답 객체 생성
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 미들웨어 전용 Supabase 클라이언트 초기화
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // sesson 정보 확인
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 보호가 필요한 경로에 대해 session 정보 확인
    // (/dashboard, /admin 등)
    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/admin'))
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
