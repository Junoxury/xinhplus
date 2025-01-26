'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Building2, MessageCircleHeart, Menu, Video, ChevronLeft, ChevronRight, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRef, useState, useEffect } from 'react'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home
  },
  {
    label: '시술찾기',
    href: '/treatments',
    icon: Search
  },
  {
    label: 'X-Video',
    href: '/shortvideo',
    icon: Video
  },
  {
    label: '병원찾기',
    href: '/clinics',
    icon: Building2
  },
  {
    label: '후기/Posting',
    href: '/reviews',
    icon: MessageCircleHeart
  },
  {
    label: '이벤트',
    href: '/events',
    icon: Gift
  },
  {
    label: '더보기',
    href: '/more',
    icon: Menu
  }
]

export function MobileNav() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // 스크롤 위치에 따라 화살표 표시 여부 업데이트
  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // 좌우 스크롤 핸들러
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 100
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateArrows)
      // 초기 화살표 상태 설정
      updateArrows()
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', updateArrows)
      }
    }
  }, [])

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-outline/5 shadow-lg">
      <div className="relative">
        {/* 왼쪽 화살표 */}
        {showLeftArrow && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background to-transparent w-6 h-full flex items-center">
            <ChevronLeft 
              className="w-4 h-4 text-primary/60" 
              onClick={() => handleScroll('left')}
            />
          </div>
        )}

        {/* 오른쪽 화살표 */}
        {showRightArrow && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background to-transparent w-6 h-full flex items-center justify-end">
            <ChevronRight 
              className="w-4 h-4 text-primary/60" 
              onClick={() => handleScroll('right')}
            />
          </div>
        )}

        {/* 메뉴 컨테이너 */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide h-[72px] px-2"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[80px] h-full gap-1 transition-all',
                  isActive 
                    ? 'text-primary scale-105' 
                    : 'text-muted-foreground/60 hover:text-primary/80'
                )}
              >
                <Icon className={cn(
                  "w-[28px] h-[28px]",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )} />
                <span className={cn(
                  "text-[11px] font-medium tracking-tight",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 아이폰 하단 노치 대응 */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </nav>
  )
} 