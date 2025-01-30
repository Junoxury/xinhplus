'use client'

import { Noto_Sans, Noto_Sans_KR } from 'next/font/google'
import "./globals.css"
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const notoSans = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
})

// 세션 관리를 위한 래퍼 컴포넌트
function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // 세션 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('토큰이 갱신되었습니다.')
      } else if (event === 'SIGNED_OUT') {
        console.log('로그아웃되었습니다.')
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        console.log('로그인되었습니다.')
      }
    })

    // 초기 세션 체크
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!session && window.location.pathname.startsWith('/reviews/form')) {
          router.push('/login')
        }
      } catch (error) {
        console.error('세션 초기화 에러:', error)
      }
    }

    initializeAuth()

    // 클린업 함수
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return <>{children}</>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={`${notoSans.variable} ${notoSansKr.variable} font-sans antialiased overflow-x-hidden`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
