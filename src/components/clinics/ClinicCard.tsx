import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

interface ClinicCardProps {
  title: string
  description: string
  image: string
  rating: number
  reviewCount: number
  location: string
  categories: string[]
  isNew?: boolean
  isAd?: boolean
}

export function ClinicCard({
  title,
  description,
  image,
  rating,
  reviewCount,
  location,
  categories,
  isNew,
  isAd
}: ClinicCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* 뱃지 영역 */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isNew && (
            <Badge className="bg-blue-500 text-white border-0">
              NEW
            </Badge>
          )}
          {isAd && (
            <Badge className="bg-yellow-500 text-white border-0">
              AD
            </Badge>
          )}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        {/* 제목 */}
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        
        {/* 병원 소개 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* 평점 & 위치 */}
        <div className="flex justify-between items-center mb-3">
          {/* 평점 & 리뷰 */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-500">({reviewCount.toLocaleString()})</span>
          </div>

          {/* 위치 */}
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1 stroke-gray-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* 카테고리 태그 */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge 
              key={category} 
              className="bg-pink-50 hover:bg-pink-100 text-pink-500 border-0"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
} 