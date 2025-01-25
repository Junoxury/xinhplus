import { PlayCircle } from 'lucide-react'
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
    <div className="group relative rounded-lg overflow-hidden">
      {/* 이미지 컨테이너 */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
        <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white z-20 opacity-80 group-hover:opacity-100 transition-opacity" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 컨텐츠 - 제목 크기 조정 */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {location} - {clinic}
        </p>
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{categories.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
} 