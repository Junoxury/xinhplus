import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_KR } from 'next/font/google'
import "./globals.css";
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from "@/components/ui/toaster"

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

export const metadata: Metadata = {
  title: "Xinh+ | 베트남 뷰티 플랫폼",
  description: "베트남 최고의 뷰티 전문가들과 함께 당신만의 아름다움을 찾아보세요",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <Header />
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
