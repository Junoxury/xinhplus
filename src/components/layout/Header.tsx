'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, User } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline/10 bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 첫 번째 영역: 로고 */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-primary">
            Xinh+
          </Link>
        </div>

        {/* 두 번째 영역: 네비게이션 메뉴 - 데스크톱 */}
        <nav className="hidden md:flex items-center justify-center space-x-8 flex-grow text-center">
          <Link href="/treatments" className="text-muted-foreground hover:text-primary transition-colors">
            시술정보
          </Link>
          <Link href="/shortvideo" className="text-muted-foreground hover:text-primary transition-colors">
            X-Video
          </Link>
          <Link href="/clinics" className="text-muted-foreground hover:text-primary transition-colors">
            병원찾기
          </Link>
          <Link href="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
            리얼후기
          </Link>
          <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
            이벤트
          </Link>
        </nav>

        {/* 세 번째 영역: 검색 박스 및 로그인/회원가입 버튼 */}
        <div className="flex items-center space-x-2 w-2/6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder=""
              className="w-full border rounded-md md:py-0.5 py-0 text-md font-medium text-gray-500 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="md:hidden">
            <Link href="/login">
              <User className="h-5 w-5 text-gray-500 hover:text-primary" />
            </Link>
          </div>
          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="solid" className="hover:text-white hover:bg-primary">
                로그인/회원가입
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 