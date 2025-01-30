import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Supabase 클라이언트 생성
  const supabase = createMiddlewareClient({ 
    req, 
    res,
  })

  try {
    // 세션 새로고침 시도
    const { data: { session } } = await supabase.auth.getSession()
    
    // 디버깅을 위한 로그
    console.log('Middleware Session:', session)

    if (req.nextUrl.pathname.startsWith('/reviews/form')) {
      if (!session) {
        console.log('No session found')
      } else {
        console.log('Session found:', session.user)
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ['/reviews/form']
} 