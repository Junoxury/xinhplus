import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 가장 기본적인 로그부터 확인
  console.log('Middleware is running!')
  console.log('Request path:', req.nextUrl.pathname)

  const res = NextResponse.next()
  
  // Supabase 클라이언트 생성
  const supabase = createMiddlewareClient({ req, res })

  try {
    console.log("=== Middleware Check Start ===")
    console.log("Current path:", req.nextUrl.pathname)

    // 세션 체크
    const { data, error } = await supabase.auth.getSession()
    console.log("Session data:", data)
    console.log("Session error:", error)

    // 보호된 경로에 대한 접근 체크
    const protectedPaths = ['/reviews/form', '/treatments/consult']
    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )
    console.log("Is protected path:", isProtectedPath)
    console.log("Has session:", !!data.session)

    // 세션 체크만 하고 리다이렉트는 하지 않음
    if (isProtectedPath && !data.session) {
      console.log("No session found for protected path")
    }

    console.log("=== Middleware Check End ===")
    return res

  } catch (error) {
    console.error('Middleware detailed error:', error)
    return res
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/reviews/form',
    '/treatments/consult',
    '/treatments/consult/:path*'
  ]
} 