import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

interface ClinicCardProps {
  id: string
  name: string
  image: string
  description: string
  location: string
  rating: number
  reviewCount: number
  categories?: string[]
  isRecommended?: boolean
  isAd?: boolean
  isMember?: boolean
}

export function ClinicCard({
  id,
  name,
  image,
  description,
  location,
  rating,
  reviewCount,
  categories = [],
  isRecommended = false,
  isAd = false,
  isMember = false
}: ClinicCardProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [maxVisibleCount, setMaxVisibleCount] = useState(4)
  
  // 모바일 체크 - useEffect 내부에서만 window 접근
  useEffect(() => {
    const handleResize = () => {
      setMaxVisibleCount(window.innerWidth < 768 ? 3 : 4)
    }
    
    // 초기 설정
    handleResize()
    
    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 보여줄 카테고리와 남은 개수 계산
  const visibleCategories = categories.slice(0, maxVisibleCount)
  const remainingCount = Math.max(0, categories.length - maxVisibleCount)

  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      {/* 이미지 섹션 */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isRecommended && (
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              추천
            </div>
          )}
          {isAd && (
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              AD
            </div>
          )}
          {isMember && (
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Member
            </div>
          )}
        </div>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className="p-4">
        {/* Title and bookmark */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold line-clamp-2 flex-1 mr-2">{name}</h3>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-2">{location}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-bold mr-1">{rating.toFixed(1)}</span>
          <span className="text-gray-600">({reviewCount.toLocaleString()})</span>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="relative">
            <div className={`flex flex-wrap gap-1 ${showAllCategories ? '' : 'min-h-[64px] max-h-[64px] overflow-hidden'}`}>
              {(showAllCategories ? categories : visibleCategories).map((category, index) => (
                <Badge 
                  key={index} 
                  className="rounded-full text-xs px-3 h-7 bg-pink-100 hover:bg-pink-200 text-pink-800 border-0 flex items-center"
                >
                  {category}
                </Badge>
              ))}
              {!showAllCategories && remainingCount > 0 && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="rounded-full text-xs px-3 h-7 bg-pink-100 hover:bg-pink-200 text-pink-800 border-0 transition-colors flex items-center"
                >
                  +{remainingCount}
                </button>
              )}
            </div>
            {showAllCategories && (
              <button
                onClick={() => setShowAllCategories(false)}
                className="absolute top-0 right-0 text-xs text-gray-500 hover:text-gray-700 h-7 flex items-center px-2"
              >
                접기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 