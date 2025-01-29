import { useState } from 'react'
import Image from 'next/image'
import { Star, Lock, MapPin, MessageCircle, Eye, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ReviewCardProps {
  beforeImage: string
  afterImage: string
  additionalImagesCount?: number
  rating: number
  content: string
  author: string
  authorImage?: string
  date: string
  treatmentName: string
  categories: string[]
  isAuthenticated?: boolean
  location: string
  clinicName: string
  commentCount: number
  viewCount: number
  isGoogle?: boolean
  likeCount: number
}

export function ReviewCard({
  beforeImage,
  afterImage,
  additionalImagesCount = 0,
  rating,
  content,
  author,
  authorImage,
  date,
  treatmentName,
  categories = [],
  isAuthenticated = false,
  location,
  clinicName,
  commentCount = 0,
  viewCount = 0,
  isGoogle = false,
  likeCount = 0
}: ReviewCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* 이미지 갤러리 */}
      <div className="relative flex h-[200px] md:h-[240px]">
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
          <div className="relative w-full h-full">
            <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Before 라벨과 추가 이미지 수는 항상 표시 */}
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-[4px] z-[110]">
            Before
          </div>
          {additionalImagesCount > 0 && (
            <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-[4px] z-[110]">
              +{additionalImagesCount}
            </div>
          )}

          {/* 로그인하지 않은 경우 Sign-in 오버레이로 부분적으로 가림 */}
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-[105]">
              <div className="text-center bg-black/40 px-6 py-4 rounded-xl backdrop-blur-sm">
                <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white font-medium text-sm">Sign-in</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 컨텐츠 섹션 - 패딩 축소 */}
      <div className="p-3">
        {/* 제목, 작성자, 날짜 */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">{treatmentName}</h3>
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={authorImage} alt={author} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author}</span>
            <span className="text-sm text-gray-500">·</span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
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

        {/* 평점과 댓글 수, 조회수, 좋아요 수 */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative">
                  {/* 빈 별 (회색) */}
                  <Star className="w-4 h-4 text-gray-300" />
                  
                  {/* 채워진 별 (노란색) - width로 부분 채우기 */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (rating - (star - 1)) * 100))}%`
                    }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{commentCount}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{viewCount}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>{likeCount}</span>
              </div>
            </div>
          </div>
          {isGoogle && (
            <div className="flex items-center text-sm text-gray-500 justify-center">
              <div className="flex items-center">
                <span className="flex items-center align-middle">Powered by</span>
                <Image
                  src="https://www.google.com/images/poweredby_transparent/poweredby_000000.gif"
                  alt="Google"
                  width={48}
                  height={48}
                  className="ml-1 align-middle"
                  style={{ marginTop: '0.4em' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 리뷰 내용 - 더보기 기능 제거하고 고정된 길이로 표시 */}
        <div className="text-sm text-gray-600 line-clamp-3">
          {content}
        </div>
      </div>
    </div>
  )
} 