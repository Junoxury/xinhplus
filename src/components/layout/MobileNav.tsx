'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Building2, MessageCircleHeart, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    label: '더보기',
    href: '/more',
    icon: Menu
  }
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-outline/5 shadow-lg">
      <div className="flex justify-around items-center h-[72px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-2 transition-all',
                isActive 
                  ? 'text-primary scale-105' 
                  : 'text-muted-foreground/60 hover:text-primary/80'
              )}
            >
              <Icon className={cn(
                "w-[24px] h-[24px]",
                isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
              )} />
              <span className={cn(
                "text-[12px] font-medium tracking-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* 아이폰 하단 노치 대응 */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </nav>
  )
} 