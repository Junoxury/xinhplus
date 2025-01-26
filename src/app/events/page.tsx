import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { FloatingSocialButtons } from '@/components/common/FloatingSocialButtons'
import { Scissors, Heart, Church, Flower2 } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">
            New Life Plus x Xinh+ 특별 이벤트
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            성형 수술 및 시술 특별 할인 프로모션
          </p>
        </div>

        {/* 메인 이미지 */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
          <Image
            src="/images/events/surgery-promotion.jpg"
            alt="성형 수술 프로모션"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 서비스 소개 섹션 */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* 미용 서비스 카드 */}
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors mx-auto">
                <Scissors size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-pink-600 text-center">미용 서비스</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  성형 수술 최대 30% 할인
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  피부 관리 패키지 할인
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  무료 상담 및 컨설팅
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-pink-100">
                <p className="text-sm text-gray-500 italic">
                  "New Life Plus와 Xinh+가 함께하는 특별한 뷰티 프로모션"
                </p>
              </div>
            </div>

            {/* 웨딩 서비스 카드 */}
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors mx-auto">
                <Church size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-pink-600 text-center">웨딩 서비스</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  웨딩 드레스 대여 할인
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  웨딩 포토 촬영 패키지
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  웨딩 플래닝 서비스
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-pink-100">
                <p className="text-sm text-gray-500 italic">
                  "완벽한 순간을 위한 토탈 웨딩 솔루션"
                </p>
              </div>
            </div>

            {/* 상조 서비스 카드 */}
            <div className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors mx-auto">
                <Flower2 size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-pink-600 text-center">상조 서비스</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  프리미엄 상조 패키지
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  맞춤형 장례 서비스
                </p>
                <p className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  24시간 전문 상담
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-pink-100">
                <p className="text-sm text-gray-500 italic">
                  "품격 있는 예우로 마지막까지 함께하는 서비스"
                </p>
              </div>
            </div>
          </div>

          {/* CTA 섹션 */}
          <div className="text-center mb-20">
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
            >
              지금 신청하기
            </Button>
          </div>
        </div>
      </section>

      {/* 플로팅 소셜 버튼 */}
      <FloatingSocialButtons />
    </div>
  )
} 