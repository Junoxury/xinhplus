'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface UserData {
  email: string
}

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // 현재 로그인된 사용자 정보 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUser({ email: user.email })
      }
    }

    getUser()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUser({ email: session.user.email })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 이메일의 첫 글자를 가져오는 함수
  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  // 현재 경로가 특정 메뉴에 속하는지 확인하는 함수
  const isActiveMenu = (path: string) => {
    if (path === '/reviews' && (pathname === '/reviews' || pathname === '/posts')) return true
    if (path === '/treatments' && pathname.startsWith('/treatments')) return true
    if (path === '/shortvideo' && pathname.startsWith('/shortvideo')) return true
    if (path === '/clinics' && pathname.startsWith('/clinics')) return true
    if (path === '/events' && pathname.startsWith('/events')) return true
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-outline/10 bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* 로고 */}
        <div className="w-[140px]">
          <Link href="/" className="text-xl font-bold text-primary">
            Xinh+
          </Link>
        </div>

        {/* 네비게이션 메뉴 - 데스크톱 */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {[
            { href: '/treatments', label: '시술정보' },
            { href: '/shortvideo', label: 'X-Video' },
            { href: '/clinics', label: '병원찾기' },
            { href: '/reviews', label: '리얼후기' },
            { href: '/events', label: '이벤트' },
          ].map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className={cn(
                'transition-colors relative py-1',
                isActiveMenu(menu.href)
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {menu.label}
              {isActiveMenu(menu.href) && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* 로그인/회원가입 또는 사용자 정보 */}
        <div className="w-[240px] flex justify-end items-center">
          {user ? (
            // 로그인 상태
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-medium">
                  {getInitial(user.email)}
                </div>
                <span className="text-sm text-gray-600 hidden md:block">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            // 비로그인 상태
            <>
              <div className="md:hidden">
                <Link href="/login">
                  <User className="h-5 w-5 text-gray-500 hover:text-primary" />
                </Link>
              </div>
              <div className="hidden md:block">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="font-medium hover:text-primary hover:border-primary"
                  >
                    로그인/회원가입
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 