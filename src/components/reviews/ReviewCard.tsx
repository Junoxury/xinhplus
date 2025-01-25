import { useState } from 'react'
import Image from 'next/image'
import { Star, Lock, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ReviewCardProps {
  beforeImage: string
  afterImage: string
  additionalImagesCount?: number
  rating: number
  content: string
  author: string
  date: string
  treatmentName: string
  categories: string[]
  isLocked?: boolean
  location: string
  clinicName: string
}

export function ReviewCard({
  beforeImage,
  afterImage,
  additionalImagesCount = 0,
  rating,
  content,
  author,
  date,
  treatmentName,
  categories = [],
  isLocked = false,
  location,
  clinicName
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 200 // 내용 표시 최대 길이

  const shouldShowMoreButton = content.length > maxLength
  const displayContent = isExpanded ? content : content.slice(0, maxLength) + '...'

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* 이미지 갤러리 */}
      <div className="relative flex h-[300px]">
        {/* After 이미지 */}
        <div className="relative w-1/2">
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-[4px] z-[100]">
            After
          </div>
        </div>
        
        {/* Before 이미지 */}
        <div className="relative w-1/2">
          <Image
            src={beforeImage}
            alt="Before"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-[4px] z-[100]">
            Before
          </div>
          {additionalImagesCount > 0 && (
            <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-[4px] z-[100]">
              +{additionalImagesCount}
            </div>
          )}
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[90]">
              <Lock className="w-6 h-6 mb-2" />
              <span>Sign-in</span>
            </div>
          )}
        </div>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className="p-4">
        {/* 제목과 날짜 */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">{treatmentName}</h3>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {categories.map((category, index) => (
            <Badge 
              key={index}
              className="rounded-full text-xs px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 border-0"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* 지역 - 병원명 추가 */}
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1 text-gray-500" />
          <span>{location}</span>
          <span className="mx-2">·</span>
          <span className="font-medium">{clinicName}</span>
        </div>

        {/* 평점 */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex items-center text-sm text-gray-500 justify-center">
            <div className="flex items-center">
              <span className="flex items-center align-middle">Powered by</span>
              <Image
                src="https://www.google.com/images/poweredby_transparent/poweredby_000000.gif"
                alt="Google"
                width={48} // 크기를 두 배로 늘림
                height={48} // 크기를 두 배로 늘림
                className="ml-1 align-middle"
                style={{ marginTop: '0.4em' }} // 이미지 위치 조정
              />
            </div>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">{displayContent}</p>
          {shouldShowMoreButton && (
            <Button
              variant="ghost"
              className="p-0 h-auto text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <><ChevronUp className="w-4 h-4 mr-1" /> 접기</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-1" /> 더보기</>
              )}
            </Button>
          )}
        </div>

        {/* 작성자 */}
        <div className="mt-3 text-sm text-gray-500">
          <span>{author}</span>
        </div>
      </div>
    </div>
  )
} 