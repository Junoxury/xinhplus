import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // 현재 사용자의 인증 상태 확인
    const { data: { user } } = await supabase.auth.getUser()

    // 로그인이 필요한 페이지들
    const authRequiredPaths = [
      '/mypage',
      '/treatments/consult',
      '/clinics/consult',
      '/reviews/form'
    ]

    // 현재 경로가 로그인이 필요한 페이지인지 확인
    const isAuthRequired = authRequiredPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    // 인증 상태 확인만 하고 리다이렉트는 하지 않음
    if (isAuthRequired) {
      console.log('Auth required path accessed. User:', !!user)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/mypage/:path*',
    '/treatments/consult/:path*',
    '/clinics/consult/:path*',
    '/reviews/form'
  ]
} 