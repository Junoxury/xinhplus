import Image from 'next/image'
import Link from 'next/link'
import { MapPin, PlayCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ShortCardProps {
  id: string
  title: string
  image: string
  location: string
  clinic: string
  categories: string[]
}

export function ShortCard({
  id,
  title,
  image,
  location,
  clinic,
  categories
}: ShortCardProps) {
  return (
    <Link href={`/shortvideo/${id}`}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
        {/* 배경 이미지 */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* 그라데이션 오버레이 - 상단과 하단에 각각 적용 */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

        {/* 재생 버튼 */}
        <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* 컨텐츠 */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* 상단: 지역과 병원명 */}
          <div className="flex items-center text-white text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
            <span className="mx-2">·</span>
            <span className="font-medium">{clinic}</span>
          </div>

          {/* 하단: 제목과 카테고리 */}
          <div>
            <h3 className="text-white text-sm font-medium mb-2 line-clamp-2">
              {title}
            </h3>
            <div className="flex gap-1 overflow-hidden">
              {categories.slice(0, 2).map((category, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="bg-black/30 border-white/30 text-white text-xs whitespace-nowrap"
                >
                  {category}
                </Badge>
              ))}
              {categories.length > 2 && (
                <Badge 
                  variant="outline"
                  className="bg-black/30 border-white/30 text-white text-xs whitespace-nowrap"
                >
                  +{categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 