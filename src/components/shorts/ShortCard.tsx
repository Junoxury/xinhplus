import { PlayCircle, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ShortCardProps {
  id: string
  image: string
  title: string
  location: string
  clinic: string
  categories: string[]
}

export function ShortCard({
  image,
  title,
  location,
  clinic,
  categories
}: ShortCardProps) {
  return (
    <div className="group relative aspect-[3/4] rounded-xl overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* 오버레이 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      {/* 재생 아이콘 */}
      <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white z-20 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* 컨텐츠 영역 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* 제목 */}
        <h3 className="text-base font-medium line-clamp-2 mb-2">{title}</h3>

        {/* 위치 & 병원 */}
        <div className="flex items-center gap-1 text-sm mb-2 text-white/90">
          <MapPin className="w-4 h-4" />
          <span>{location} - {clinic}</span>
        </div>

        {/* 카테고리 */}
        <div className="flex gap-1">
          {categories.slice(0, 2).map((category) => (
            <Badge 
              key={category} 
              className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
} 