import Link from 'next/link'
import { Star } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-between">
          {/* 회사 정보 */}
          <div className="w-full md:w-1/4 mb-4">
            <h3 className="text-white font-bold mb-4">Xinh+</h3>
            <p className="text-sm">
              최고의 뷰티 전문가들과 함께<br />
              당신만의 아름다움을 찾아보세요
            </p>
          </div>

          {/* 빠른 링크 */}
          <div className="w-full md:w-1/4 mb-4">
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/treatments">시술정보</Link></li>
              <li><Link href="/clinics">병원찾기</Link></li>
              <li><Link href="/reviews">리얼후기</Link></li>
              <li><Link href="/events">이벤트</Link></li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div className="w-full md:w-1/4 mb-4">
            <h4 className="text-white font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq">자주 묻는 질문</Link></li>
              <li><Link href="/contact">문의하기</Link></li>
              <li><Link href="/terms">이용약관</Link></li>
              <li><Link href="/privacy">개인정보처리방침</Link></li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="w-full md:w-1/4 mb-4">
            <h4 className="text-white font-semibold mb-4">고객센터</h4>
            <p className="text-2xl font-bold text-white mb-2">1544-0000</p>
            <p className="text-sm mb-4">
              평일 09:00 - 18:00<br />
              점심시간 12:00 - 13:00
            </p>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; 2024 Xinh+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 